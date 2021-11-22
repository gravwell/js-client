/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omit, random, sortBy } from 'lodash';
import { CreatableToken, CreatableUser, isToken, Token, TokenCapability, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';
import { makeGetTokensAuthorizedToMe } from './get-tokens-authorized-to-me';

describe('getTokensAuthorizedToMe()', () => {
	const getTokensAuthorizedToMe = makeGetTokensAuthorizedToMe(TEST_BASE_API_CONTEXT);
	const createOneToken = makeCreateOneToken(TEST_BASE_API_CONTEXT);
	const deleteOneToken = makeDeleteOneToken(TEST_BASE_API_CONTEXT);
	const getAllTokens = makeGetAllTokens(TEST_BASE_API_CONTEXT);
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);

	let adminTokens: Array<Token>;

	let analyst: User;
	let analystAuth: string;
	let analystTokens: Array<Token>;

	beforeEach(async () => {
		// Delete all tokens
		const currentTokens = await getAllTokens();
		const currentTokenIDs = currentTokens.map(t => t.id);
		const deletePromises = currentTokenIDs.map(TokenID => deleteOneToken(TokenID));
		await Promise.all(deletePromises);

		// Create two tokens as admin
		const creatableTokens: Array<CreatableToken> = [
			{
				name: 'T1',
				capabilities: [TokenCapability.KitWrite],
			},
			{
				name: 'T2',
				capabilities: [TokenCapability.Download],
			},
		];
		const createPromises = creatableTokens.map(creatable => createOneToken(creatable));
		adminTokens = (await Promise.all(createPromises)).map(t => omit(t, ['token']));

		// Creates an analyst
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		analyst = await createOneUser(data);
		analystAuth = await login(analyst.username, data.password);

		// Create three tokens as analyst
		const creatableTokens2: Array<CreatableToken> = [
			{
				name: 'T1',
				capabilities: [TokenCapability.KitWrite],
			},
			{
				name: 'T2',
				capabilities: [TokenCapability.Download],
			},
			{
				name: 'T3',
				capabilities: [TokenCapability.Download],
			},
		];

		const createOneTokenAsAnalyst = makeCreateOneToken({
			...TEST_BASE_API_CONTEXT,
			authToken: analystAuth,
		});

		const createPromises2 = creatableTokens2.map(creatable => createOneTokenAsAnalyst(creatable));
		analystTokens = (await Promise.all(createPromises2)).map(t => omit(t, ['token']));
	});

	it(
		'Returns all my tokens',
		integrationTest(async () => {
			const actualAdminTokens = await getTokensAuthorizedToMe();
			expect(sortBy(actualAdminTokens, t => t.id)).toEqual(sortBy(adminTokens, t => t.id));
			for (const token of actualAdminTokens) expect(isToken(token)).toBeTrue();

			const getTokensAuthorizedToAnalyst = makeGetTokensAuthorizedToMe({
				...TEST_BASE_API_CONTEXT,
				authToken: analystAuth,
			});

			const actualAnalystTokens = await getTokensAuthorizedToAnalyst();
			expect(sortBy(actualAnalystTokens, t => t.id)).toEqual(sortBy(analystTokens, t => t.id));
			for (const token of actualAnalystTokens) expect(isToken(token)).toBeTrue();

			const allTokens = await getAllTokens();
			expect(sortBy(allTokens, t => t.id)).toEqual(sortBy([...analystTokens, ...adminTokens], t => t.id));
			for (const token of allTokens) expect(isToken(token)).toBeTrue();
		}),
	);
});

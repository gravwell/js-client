/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omit, random, sortBy } from 'lodash';
import { CreatableToken } from '~/models/token/creatable-token';
import { isToken } from '~/models/token/is-token';
import { Token } from '~/models/token/token';
import { TokenCapability } from '~/models/token/token-capability';
import { CreatableUser } from '~/models/user/creatable-user';
import { User } from '~/models/user/user';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users/create-one-user';
import { makeDeleteOneUser } from '../users/delete-one-user';
import { makeGetAllUsers } from '../users/get-all-users';
import { makeGetMyUser } from '../users/get-my-user';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';
import { makeGetTokensAuthorizedToMe } from './get-tokens-authorized-to-me';

describe(
	'getTokensAuthorizedToMe()',
	integrationTestSpecDef(() => {
		let getTokensAuthorizedToMe: ReturnType<typeof makeGetTokensAuthorizedToMe>;
		beforeAll(async () => {
			getTokensAuthorizedToMe = makeGetTokensAuthorizedToMe(await TEST_BASE_API_CONTEXT());
		});
		let createOneToken: ReturnType<typeof makeCreateOneToken>;
		beforeAll(async () => {
			createOneToken = makeCreateOneToken(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneToken: ReturnType<typeof makeDeleteOneToken>;
		beforeAll(async () => {
			deleteOneToken = makeDeleteOneToken(await TEST_BASE_API_CONTEXT());
		});
		let getAllTokens: ReturnType<typeof makeGetAllTokens>;
		beforeAll(async () => {
			getAllTokens = makeGetAllTokens(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneUser: ReturnType<typeof makeDeleteOneUser>;
		beforeAll(async () => {
			deleteOneUser = makeDeleteOneUser(await TEST_BASE_API_CONTEXT());
		});
		let getAllUsers: ReturnType<typeof makeGetAllUsers>;
		beforeAll(async () => {
			getAllUsers = makeGetAllUsers(await TEST_BASE_API_CONTEXT());
		});
		let getMyUser: ReturnType<typeof makeGetMyUser>;
		beforeAll(async () => {
			getMyUser = makeGetMyUser(await TEST_BASE_API_CONTEXT());
		});

		let adminTokens: Array<Token>;

		let analyst: User;
		let analystAuth: string;
		let analystTokens: Array<Token>;

		beforeEach(async () => {
			// Delete all users, except the admin
			const currentUsers = await getAllUsers();
			const myUser = await getMyUser();
			const currentUserIDs = currentUsers.map(u => u.id).filter(userID => userID !== myUser.id);
			const deleteUserPromises = currentUserIDs.map(userID => deleteOneUser(userID));
			await Promise.all(deleteUserPromises);

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
				username: userSeed,
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
				...(await TEST_BASE_API_CONTEXT()),
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
				for (const token of actualAdminTokens) {
					expect(isToken(token)).toBeTrue();
				}

				const getTokensAuthorizedToAnalyst = makeGetTokensAuthorizedToMe({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: analystAuth,
				});

				const actualAnalystTokens = await getTokensAuthorizedToAnalyst();
				expect(sortBy(actualAnalystTokens, t => t.id)).toEqual(sortBy(analystTokens, t => t.id));
				for (const token of actualAnalystTokens) {
					expect(isToken(token)).toBeTrue();
				}

				const allTokens = await getAllTokens();
				expect(sortBy(allTokens, t => t.id)).toEqual(sortBy([...analystTokens, ...adminTokens], t => t.id));
				for (const token of allTokens) {
					expect(isToken(token)).toBeTrue();
				}
			}),
		);
	}),
);

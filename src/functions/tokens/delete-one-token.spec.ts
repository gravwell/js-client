/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableToken } from '~/models/token/creatable-token';
import { TokenCapability } from '~/models/token/token-capability';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';
import { makeGetOneToken } from './get-one-token';

describe(
	'deleteOneToken()',
	integrationTestSpecDef(() => {
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
		let getOneToken: ReturnType<typeof makeGetOneToken>;
		beforeAll(async () => {
			getOneToken = makeGetOneToken(await TEST_BASE_API_CONTEXT());
		});

		beforeEach(async () => {
			// Delete all tokens
			const currentTokens = await getAllTokens();
			const currentTokenIDs = currentTokens.map(t => t.id);
			const deletePromises = currentTokenIDs.map(tokenID => deleteOneToken(tokenID));
			await Promise.all(deletePromises);

			// Create two tokens
			const creatableTokens: Array<CreatableToken> = [
				{
					name: 'T1',
					capabilities: [TokenCapability.KitWrite],
				},
				{
					name: 'T2',
					capabilities: [TokenCapability.KitWrite],
				},
			];
			const createPromises = creatableTokens.map(creatable => createOneToken(creatable));
			await Promise.all(createPromises);
		});

		it(
			'Should delete a token',
			integrationTest(async () => {
				const currentTokens = await getAllTokens();
				const currentTokenIDs = currentTokens.map(t => t.id);
				expect(currentTokenIDs.length).toBe(2);

				const deleteTokenID = currentTokenIDs[0];
				assertIsNotNil(deleteTokenID);

				await deleteOneToken(deleteTokenID);
				await expectAsync(getOneToken(deleteTokenID)).toBeRejected();

				const remainingTokens = await getAllTokens();
				const remainingTokenIDs = remainingTokens.map(t => t.id);
				expect(remainingTokenIDs).not.toContain(deleteTokenID);
				expect(remainingTokenIDs.length).toBe(1);
			}),
		);
	}),
);

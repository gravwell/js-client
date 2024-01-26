/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableToken } from '~/models/token/creatable-token';
import { isToken } from '~/models/token/is-token';
import { TokenCapability } from '~/models/token/token-capability';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';

describe(
	'getAllTokens()',
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

		beforeEach(async () => {
			// Delete all tokens
			const currentTokens = await getAllTokens();
			const currentTokenIDs = currentTokens.map(t => t.id);
			const deletePromises = currentTokenIDs.map(TokenID => deleteOneToken(TokenID));
			await Promise.all(deletePromises);
		});

		it(
			'Should return all tokens',
			integrationTest(async () => {
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

				const tokens = await getAllTokens();
				expect(tokens.length).toBe(2);
				expect(tokens.every(isToken)).toBeTrue();
			}),
		);

		it(
			'Should return an empty array if there are no tokens',
			integrationTest(async () => {
				const tokens = await getAllTokens();
				expect(tokens.length).toBe(0);
			}),
		);
	}),
);

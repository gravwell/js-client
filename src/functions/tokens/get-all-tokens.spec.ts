/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableToken, isToken, TokenCapability } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';

describe('getAllTokens()', () => {
	const createOneToken = makeCreateOneToken(TEST_BASE_API_CONTEXT);
	const deleteOneToken = makeDeleteOneToken(TEST_BASE_API_CONTEXT);
	const getAllTokens = makeGetAllTokens(TEST_BASE_API_CONTEXT);

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
});

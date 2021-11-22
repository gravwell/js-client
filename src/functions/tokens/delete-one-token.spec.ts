/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableToken, TokenCapability } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';
import { makeGetOneToken } from './get-one-token';

describe('deleteOneToken()', () => {
	const createOneToken = makeCreateOneToken(TEST_BASE_API_CONTEXT);
	const deleteOneToken = makeDeleteOneToken(TEST_BASE_API_CONTEXT);
	const getAllTokens = makeGetAllTokens(TEST_BASE_API_CONTEXT);
	const getOneToken = makeGetOneToken(TEST_BASE_API_CONTEXT);

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
			await deleteOneToken(deleteTokenID);
			await expectAsync(getOneToken(deleteTokenID)).toBeRejected();

			const remainingTokens = await getAllTokens();
			const remainingTokenIDs = remainingTokens.map(t => t.id);
			expect(remainingTokenIDs).not.toContain(deleteTokenID);
			expect(remainingTokenIDs.length).toBe(1);
		}),
	);
});

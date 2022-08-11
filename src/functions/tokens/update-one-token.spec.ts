/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableToken, isToken, Token, TokenCapability, UpdatableToken } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';
import { makeUpdateOneToken } from './update-one-token';

describe('updateOneToken()', () => {
	let createOneToken: ReturnType<typeof makeCreateOneToken>;
	beforeAll(async () => {
		createOneToken = makeCreateOneToken(await TEST_BASE_API_CONTEXT());
	});
	let updateOneToken: ReturnType<typeof makeUpdateOneToken>;
	beforeAll(async () => {
		updateOneToken = makeUpdateOneToken(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneToken: ReturnType<typeof makeDeleteOneToken>;
	beforeAll(async () => {
		deleteOneToken = makeDeleteOneToken(await TEST_BASE_API_CONTEXT());
	});
	let getAllTokens: ReturnType<typeof makeGetAllTokens>;
	beforeAll(async () => {
		getAllTokens = makeGetAllTokens(await TEST_BASE_API_CONTEXT());
	});

	let createdToken: Token;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all tokens
		const currentTokens = await getAllTokens();
		const currentTokenIDs = currentTokens.map(m => m.id);
		const deletePromises = currentTokenIDs.map(TokenID => deleteOneToken(TokenID));
		await Promise.all(deletePromises);

		// Create one token
		const data: CreatableToken = {
			name: 'Current name',
			capabilities: [TokenCapability.KitWrite],
		};
		createdToken = await createOneToken(data);
	});

	const updateTests: Array<Omit<UpdatableToken, 'id'>> = [
		{ name: 'New Name' },

		{ description: 'New description' },
		{ description: null },

		{ capabilities: [TokenCapability.Stats] },
		{ capabilities: [TokenCapability.SystemInfoRead, TokenCapability.SearchHistory, TokenCapability.SearchAllHistory] },

		{ expiresAt: new Date() },
		{ expiresAt: null },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields = Object.keys(_data);
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		it(
			`Test ${formatedTestIndex}: Should update a token ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdToken;
				expect(isToken(current)).toBeTrue();

				const data: UpdatableToken = { ..._data, id: current.id };
				const updated = await updateOneToken(data);

				expect(isToken(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(data);
			}),
		);
	});
});

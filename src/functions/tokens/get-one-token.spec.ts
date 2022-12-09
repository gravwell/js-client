/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omit } from 'lodash';
import { CreatableToken, isToken, TokenCapability, TokenWithSecret } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneToken } from './create-one-token';
import { makeDeleteOneToken } from './delete-one-token';
import { makeGetAllTokens } from './get-all-tokens';
import { makeGetOneToken } from './get-one-token';

describe(
	'getOneToken()',
	integrationTestSpecDef(() => {
		let getOneToken: ReturnType<typeof makeGetOneToken>;
		beforeAll(async () => {
			getOneToken = makeGetOneToken(await TEST_BASE_API_CONTEXT());
		});
		let createOneToken: ReturnType<typeof makeCreateOneToken>;
		beforeAll(async () => {
			createOneToken = makeCreateOneToken(await TEST_BASE_API_CONTEXT());
		});
		let getAllTokens: ReturnType<typeof makeGetAllTokens>;
		beforeAll(async () => {
			getAllTokens = makeGetAllTokens(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneToken: ReturnType<typeof makeDeleteOneToken>;
		beforeAll(async () => {
			deleteOneToken = makeDeleteOneToken(await TEST_BASE_API_CONTEXT());
		});

		let createdToken: TokenWithSecret;

		beforeEach(async () => {
			// Delete all tokens
			const currentTokens = await getAllTokens();
			const currentTokensIDs = currentTokens.map(t => t.id);
			const deletePromises = currentTokensIDs.map(tokenID => deleteOneToken(tokenID));
			await Promise.all(deletePromises);

			// Create a Token
			const data: CreatableToken = {
				name: 'T1',
				description: 'My T1',
				capabilities: [TokenCapability.AttachSearch, TokenCapability.KitWrite],
			};
			createdToken = await createOneToken(data);
		});

		it(
			'Should return a token',
			integrationTest(async () => {
				const token = await getOneToken(createdToken.id);
				expect(isToken(token)).toBeTrue();
				expect(token).toEqual(omit(createdToken, ['token']));
			}),
		);

		it(
			"Should return an error if the token doesn't exist",
			integrationTest(async () => {
				await expectAsync(getOneToken('non-existent')).toBeRejected();
			}),
		);
	}),
);

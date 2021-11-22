/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableToken, isTokenWithSecret, TokenCapability } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneToken } from './create-one-token';

describe('createOneToken()', () => {
	const createOneToken = makeCreateOneToken(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);
	});

	it(
		'Should create a token and return it',
		integrationTest(async () => {
			const data: CreatableToken = {
				name: 'name',
				description: 'description',
				capabilities: [TokenCapability.KitWrite],
			};

			const token = await createOneToken(data);
			expect(isTokenWithSecret(token)).toBeTrue();
			expect(token).toPartiallyEqual(data);
		}),
	);
});

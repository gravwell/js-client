/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableToken } from '~/models/token/creatable-token';
import { isTokenWithSecret } from '~/models/token/is-token-with-secret';
import { TokenCapability } from '~/models/token/token-capability';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { myCustomMatchers } from '~/tests/custom-matchers';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneToken } from './create-one-token';

describe(
	'createOneToken()',
	integrationTestSpecDef(() => {
		let createOneToken: ReturnType<typeof makeCreateOneToken>;
		beforeAll(async () => {
			createOneToken = makeCreateOneToken(await TEST_BASE_API_CONTEXT());
		});

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
	}),
);

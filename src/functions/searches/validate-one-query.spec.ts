/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeValidateOneQuery } from './validate-one-query';

describe('validateOneQuery()', () => {
	it(
		'Should approve a valid query',
		integrationTest(async () => {
			const validateOneQuery = makeValidateOneQuery(TEST_BASE_API_CONTEXT);
			const query = 'tag=netflow netflow Src';
			const validation = await validateOneQuery(query);
			expect(validation).toEqual({ isValid: true, error: null });
		}),
	);

	it(
		'Should repprove an invalid query',
		integrationTest(async () => {
			const validateOneQuery = makeValidateOneQuery(TEST_BASE_API_CONTEXT);
			const query = 'tag=non-existant';
			const validation = await validateOneQuery(query);
			expect(validation).toEqual({
				isValid: false,
				error: { message: 'Could not match tag spec non-existant against any known tags', module: 0 },
			});
		}),
	);
});

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_BASE_API_CONTEXT, unitTest } from '~/tests';
import { makeGetAllTags } from './get-all-tags';

describe('getAllTags()', () => {
	const getAllTags = makeGetAllTags(TEST_BASE_API_CONTEXT);

	it(
		'Should return a function given a valid host',
		unitTest(() => {
			const fn = () => makeGetAllTags({ ...TEST_BASE_API_CONTEXT, host: 'www.example.com' });
			expect(fn).not.toThrow();
			expect(typeof fn()).toBe('function');
		}),
	);

	it(
		'Should return 200 with a list of tags',
		integrationTest(async () => {
			const tags = await getAllTags();
			expect(tags instanceof Array).toBe(true);
			for (const tag of tags) expect(typeof tag).toBe('string');
		}),
	);
});

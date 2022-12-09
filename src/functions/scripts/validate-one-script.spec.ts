/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeValidateOneScript } from './validate-one-script';

describe('validateOneScript()', () => {
	let validateOneScript: ReturnType<typeof makeValidateOneScript>;
	beforeAll(async () => {
		validateOneScript = makeValidateOneScript(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should approve a valid script',
		integrationTest(async () => {
			const script = '1 + 2';
			const validation = await validateOneScript(script);
			expect(validation).toEqual({ isValid: true, error: null });
		}),
	);

	it(
		'Should repprove an invalid script',
		integrationTest(async () => {
			const script = '1 + ';
			const validation = await validateOneScript(script);
			expect(validation).toEqual({ isValid: false, error: { message: 'syntax error', line: 1, column: 5 } });
		}),
	);
});

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeValidateOneScript } from './validate-one-script';

describe('validateOneScript()', () => {
	const validateOneScript = makeValidateOneScript({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
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

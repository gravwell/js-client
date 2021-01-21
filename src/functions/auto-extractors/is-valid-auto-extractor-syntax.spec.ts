/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableAutoExtractor } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeIsValidAutoExtractorSyntax } from './is-valid-auto-extractor-syntax';

describe('isValidAutoExtractorSyntax()', () => {
	const isValidAutoExtractorSyntax = makeIsValidAutoExtractorSyntax({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	it(
		'Should validate an auto extractor syntax',
		integrationTest(async () => {
			const data: CreatableAutoExtractor = {
				name: 'name',
				description: 'description',
				labels: ['Label 1', 'Label 2'],

				groupIDs: ['1', '2', '3'],
				isGlobal: false,

				tag: 'netflow',
				module: 'csv',

				parameters: 'a b c',
				arguments: '1 2 3',
			};

			const validation = await isValidAutoExtractorSyntax(data);
			expect(validation).not.toBeUndefined();
		}),
	);
});

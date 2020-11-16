/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isAutoExtractor } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { CreatableAutoExtractor, makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

describe('createOneAutoExtractor()', () => {
	const createOneAutoExtractor = makeCreateOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const getAllAutoExtractors = makeGetAllAutoExtractors({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all autoExtractors
		const currentAutoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID =>
			deleteOneAutoExtractor(TEST_AUTH_TOKEN, autoExtractorID),
		);
		await Promise.all(deletePromises);
	});

	it(
		'Should create a auto extractor and return it',
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

			const autoExtractor = await createOneAutoExtractor(TEST_AUTH_TOKEN, data);
			expect(isAutoExtractor(autoExtractor)).toBeTrue();
			expect(autoExtractor).toPartiallyEqual(data);
		}),
	);
});

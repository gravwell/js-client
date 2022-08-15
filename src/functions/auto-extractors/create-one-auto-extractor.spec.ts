/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableAutoExtractor, isAutoExtractor } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

describe('createOneAutoExtractor()', () => {
	let createOneAutoExtractor: ReturnType<typeof makeCreateOneAutoExtractor>;
	beforeAll(async () => {
		createOneAutoExtractor = makeCreateOneAutoExtractor(await TEST_BASE_API_CONTEXT());
	});
	let deleteOneAutoExtractor: ReturnType<typeof makeDeleteOneAutoExtractor>;
	beforeAll(async () => {
		deleteOneAutoExtractor = makeDeleteOneAutoExtractor(await TEST_BASE_API_CONTEXT());
	});
	let getAllAutoExtractors: ReturnType<typeof makeGetAllAutoExtractors>;
	beforeAll(async () => {
		getAllAutoExtractors = makeGetAllAutoExtractors(await TEST_BASE_API_CONTEXT());
	});

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all autoExtractors
		const currentAutoExtractors = await getAllAutoExtractors();
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID => deleteOneAutoExtractor(autoExtractorID));
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

			const autoExtractor = await createOneAutoExtractor(data);
			expect(isAutoExtractor(autoExtractor)).toBeTrue();
			expect(autoExtractor).toPartiallyEqual(data);
		}),
	);
});

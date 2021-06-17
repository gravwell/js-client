/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableAutoExtractor } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeGetAutoExtractorForTag } from './get-auto-extractor-for-tag';

describe('getAutoExtractorForTag()', () => {
	const createOneAutoExtractor = makeCreateOneAutoExtractor(TEST_BASE_API_CONTEXT);
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor(TEST_BASE_API_CONTEXT);
	const getAllAutoExtractors = makeGetAllAutoExtractors(TEST_BASE_API_CONTEXT);
	const getAutoExtractorForTag = makeGetAutoExtractorForTag(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// Delete all autoExtractors
		const currentAutoExtractors = await getAllAutoExtractors();
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID => deleteOneAutoExtractor(autoExtractorID));
		await Promise.all(deletePromises);
	});

	it(
		'Should return the auto extractor for the provided tag',
		integrationTest(async () => {
			// Create two auto extractors
			const creatableAutoExtractors: Array<CreatableAutoExtractor> = [
				{
					name: 'AE1 name',
					description: 'AE1 description',

					tag: 'netflow',
					module: 'csv',
					parameters: 'a b c',
				},
				{
					name: 'AE2 name',
					description: 'AE2 description',

					tag: 'gravwell',
					module: 'fields',
					parameters: '1 2 3',
				},
			];
			const createPromises = creatableAutoExtractors.map(creatable => createOneAutoExtractor(creatable));
			await Promise.all(createPromises);

			const ax = await getAutoExtractorForTag('gravwell');
			const gwAx = creatableAutoExtractors[1];

			expect(ax.name).toEqual(gwAx.name);
			expect(ax.description).toEqual(gwAx.description);
			expect(ax.tag).toEqual(gwAx.tag);
			expect(ax.module).toEqual(gwAx.module);
			expect(ax.parameters).toEqual(gwAx.parameters);
		}),
	);

	it(
		"Should throw if the tag doesn't exist",
		integrationTest(async () => {
			await expectAsync(getAutoExtractorForTag('nope')).toBeRejected();
		}),
	);
});

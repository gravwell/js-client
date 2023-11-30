/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableAutoExtractor } from '~/models/auto-extractor/creatable-auto-extractor';
import { isAutoExtractor } from '~/models/auto-extractor/is-auto-extractor';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

describe(
	'getAllAutoExtractors()',
	integrationTestSpecDef(() => {
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
			// Delete all autoExtractors
			const currentAutoExtractors = await getAllAutoExtractors();
			const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
			const deletePromises = currentAutoExtractorIDs.map(autoExtractorID => deleteOneAutoExtractor(autoExtractorID));
			await Promise.all(deletePromises);
		});

		it(
			'Should return all auto extractors',
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

				const autoExtractors = await getAllAutoExtractors();
				expect(autoExtractors.length).toBe(2);
				expect(autoExtractors.every(isAutoExtractor)).toBeTrue();
			}),
		);

		it(
			'Should return an empty array if there are no auto extractors',
			integrationTest(async () => {
				const autoExtractors = await getAllAutoExtractors();
				expect(autoExtractors.length).toBe(0);
			}),
		);
	}),
);

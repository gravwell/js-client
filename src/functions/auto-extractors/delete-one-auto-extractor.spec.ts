/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableAutoExtractor } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeGetOneAutoExtractor } from './get-one-auto-extractor';

describe(
	'deleteOneAutoExtractor()',
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
		let getOneAutoExtractor: ReturnType<typeof makeGetOneAutoExtractor>;
		beforeAll(async () => {
			getOneAutoExtractor = makeGetOneAutoExtractor(await TEST_BASE_API_CONTEXT());
		});

		beforeEach(async () => {
			// Delete all auto extractors
			const currentAutoExtractors = await getAllAutoExtractors();
			const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
			const deletePromises = currentAutoExtractorIDs.map(autoExtractorID => deleteOneAutoExtractor(autoExtractorID));
			await Promise.all(deletePromises);

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
		});

		it(
			'Should delete an auto extractor',
			integrationTest(async () => {
				const currentAutoExtractors = await getAllAutoExtractors();
				const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
				expect(currentAutoExtractorIDs.length).toBe(2);

				const deleteAutoExtractorID = currentAutoExtractorIDs[0];
				assertIsNotNil(deleteAutoExtractorID);
				await deleteOneAutoExtractor(deleteAutoExtractorID);
				await expectAsync(getOneAutoExtractor(deleteAutoExtractorID)).toBeRejected();

				const remainingAutoExtractors = await getAllAutoExtractors();
				const remainingAutoExtractorIDs = remainingAutoExtractors.map(m => m.id);
				expect(remainingAutoExtractorIDs).not.toContain(deleteAutoExtractorID);
				expect(remainingAutoExtractorIDs.length).toBe(1);
			}),
		);
	}),
);

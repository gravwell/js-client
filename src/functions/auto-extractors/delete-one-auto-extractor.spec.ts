/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { CreatableAutoExtractor, makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeGetOneAutoExtractor } from './get-one-auto-extractor';

describe('deleteOneAutoExtractor()', () => {
	const createOneAutoExtractor = makeCreateOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const getAllAutoExtractors = makeGetAllAutoExtractors({ host: TEST_HOST, useEncryption: false });
	const getOneAutoExtractor = makeGetOneAutoExtractor({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		// Delete all auto extractors
		const currentAutoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID =>
			deleteOneAutoExtractor(TEST_AUTH_TOKEN, autoExtractorID),
		);
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
		const createPromises = creatableAutoExtractors.map(creatable => createOneAutoExtractor(TEST_AUTH_TOKEN, creatable));
		await Promise.all(createPromises);
	});

	it(
		'Should delete an auto extractor',
		integrationTest(async () => {
			const currentAutoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
			const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
			expect(currentAutoExtractorIDs.length).toBe(2);

			const deleteAutoExtractorID = currentAutoExtractorIDs[0];
			await deleteOneAutoExtractor(TEST_AUTH_TOKEN, deleteAutoExtractorID);
			await expectAsync(getOneAutoExtractor(TEST_AUTH_TOKEN, deleteAutoExtractorID)).toBeRejected();

			const remainingAutoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
			const remainingAutoExtractorIDs = remainingAutoExtractors.map(m => m.id);
			expect(remainingAutoExtractorIDs).not.toContain(deleteAutoExtractorID);
			expect(remainingAutoExtractorIDs.length).toBe(1);
		}),
	);
});

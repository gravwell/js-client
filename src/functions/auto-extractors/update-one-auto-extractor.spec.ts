/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { AutoExtractor, CreatableAutoExtractor, isAutoExtractor, UpdatableAutoExtractor } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeUpdateOneAutoExtractor } from './update-one-auto-extractor';

describe('updateOneAutoExtractor()', () => {
	const createOneAutoExtractor = makeCreateOneAutoExtractor(TEST_BASE_API_CONTEXT);
	const updateOneAutoExtractor = makeUpdateOneAutoExtractor(TEST_BASE_API_CONTEXT);
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor(TEST_BASE_API_CONTEXT);
	const getAllAutoExtractors = makeGetAllAutoExtractors(TEST_BASE_API_CONTEXT);

	let createdAutoExtractor: AutoExtractor;
	let createdAutoExtractor2: AutoExtractor;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		// Delete all auto extractors
		const currentAutoExtractors = await getAllAutoExtractors();
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID => deleteOneAutoExtractor(autoExtractorID));
		await Promise.all(deletePromises);

		// Create one auto extractor
		const data: CreatableAutoExtractor = {
			name: 'AE1 name',
			description: 'AE1 description',

			tag: 'netflow',
			module: 'csv',
			parameters: 'a b c',
		};
		createdAutoExtractor = await createOneAutoExtractor(data);

		// Create one more
		const data2: CreatableAutoExtractor = {
			name: 'AE2 name',
			description: 'AE2 description',

			tag: 'gravwell',
			module: 'json',
			parameters: 'a b c',
		};
		createdAutoExtractor2 = await createOneAutoExtractor(data2);
	});

	const updateTests: Array<Omit<UpdatableAutoExtractor, 'id'>> = [
		{ name: 'New Name' },
		{ description: 'New description' },

		{ groupIDs: ['1'] },
		{ groupIDs: ['1', '2'] },
		{ groupIDs: [] },

		{ labels: ['Label 1'] },
		{ labels: ['Label 1', 'Label 2'] },
		{ labels: [] },

		{ isGlobal: true },
		{ isGlobal: false },

		{ tag: 'gravwell' },
		{ tag: 'test' },

		{ module: 'fields', parameters: '1 2 3', arguments: 'abc' },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields = Object.keys(_data);
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		it(
			`Test ${formatedTestIndex}: Should update a auto extractor ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdAutoExtractor;
				expect(isAutoExtractor(current)).toBeTrue();

				const data: UpdatableAutoExtractor = { ..._data, id: current.id };
				const updated = await updateOneAutoExtractor(data);

				expect(isAutoExtractor(updated)).toBeTrue();
				expect(updated).toPartiallyEqual(data);
			}),
		);
	});

	// Waiting on the backend because, right now, it accepts invalid data without throwing
	xit(
		'Should return a syntax error if attempt to update the auto extractor with an invalid syntax',
		integrationTest(async () => {
			expect(isAutoExtractor(createdAutoExtractor)).toBeTrue();
			expect(isAutoExtractor(createdAutoExtractor2)).toBeTrue();
			expect(createdAutoExtractor.tag).not.toBe(createdAutoExtractor2.tag);

			const invalidData: UpdatableAutoExtractor = {
				id: createdAutoExtractor.id,
				tag: createdAutoExtractor2.tag,
			};
			await expectAsync(updateOneAutoExtractor(invalidData)).toBeRejectedWithError(
				Error,
				'Parse error for extractor on tag netflow: Unknown IPFix specifier',
			);
		}),
	);
});

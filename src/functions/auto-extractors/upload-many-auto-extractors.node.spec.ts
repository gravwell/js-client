/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { isAutoExtractor } from '~/models/auto-extractor/is-auto-extractor';
import { TEST_ASSETS_PATH, TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeUploadManyAutoExtractors } from './upload-many-auto-extractors';

describe(
	'setOneAutoExtractorContent()',
	integrationTestSpecDef(() => {
		let deleteOneAutoExtractor: ReturnType<typeof makeDeleteOneAutoExtractor>;
		beforeAll(async () => {
			deleteOneAutoExtractor = makeDeleteOneAutoExtractor(await TEST_BASE_API_CONTEXT());
		});
		let uploadManyAutoExtractors: ReturnType<typeof makeUploadManyAutoExtractors>;
		beforeAll(async () => {
			uploadManyAutoExtractors = makeUploadManyAutoExtractors(await TEST_BASE_API_CONTEXT());
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
			'Should upload an auto extractor file and create the auto extractors defined in the file',
			integrationTest(async () => {
				const autoExtractors1 = await getAllAutoExtractors();
				expect(autoExtractors1.length).toBe(0);

				const createFileStream = (): ReadStream => createReadStream(join(TEST_ASSETS_PATH!, 'auto-extractors.config'));
				const fileStream = createFileStream();
				const autoExtractors2 = await uploadManyAutoExtractors({ file: fileStream });
				expect(autoExtractors2.length).toBe(2);
				for (const ae of autoExtractors2) {
					expect(isAutoExtractor(ae)).toBeTrue();
				}
			}),
			10000,
		);
	}),
);

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { createReadStream } from 'fs';
import { join } from 'path';
import { isAutoExtractor } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_ASSETS_PATH, TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeUploadManyAutoExtractors } from './upload-many-auto-extractors';

describe('setOneAutoExtractorContent()', () => {
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor({ host: TEST_HOST, useEncryption: false });
	const uploadManyAutoExtractors = makeUploadManyAutoExtractors({ host: TEST_HOST, useEncryption: false });
	const getAllAutoExtractors = makeGetAllAutoExtractors({ host: TEST_HOST, useEncryption: false });

	beforeEach(async () => {
		// Delete all autoExtractors
		const currentAutoExtractors = await getAllAutoExtractors(TEST_AUTH_TOKEN);
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID =>
			deleteOneAutoExtractor(TEST_AUTH_TOKEN, autoExtractorID),
		);
		await Promise.all(deletePromises);
	});

	it(
		'Should upload an auto extractor file and create the auto extractors defined in the file',
		integrationTest(async () => {
			const autoExtractors1 = await getAllAutoExtractors(TEST_AUTH_TOKEN);
			expect(autoExtractors1.length).toBe(0);

			const createFileStream = () => createReadStream(join(TEST_ASSETS_PATH!, 'auto-extractors.config'));
			const fileStream = createFileStream();

			const autoExtractors2 = await uploadManyAutoExtractors(TEST_AUTH_TOKEN, { file: fileStream });
			expect(autoExtractors2.length).toBe(2);
			for (const ae of autoExtractors2) expect(isAutoExtractor(ae)).toBeTrue();
		}),
		10000,
	);
});

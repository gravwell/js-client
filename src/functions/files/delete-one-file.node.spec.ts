/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { createReadStream } from 'fs';
import { join } from 'path';
import { CreatableFile } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_ASSETS_PATH, TEST_BASE_API_CONTEXT } from '~/tests';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneFile } from './create-one-file';
import { makeDeleteOneFile } from './delete-one-file';
import { makeGetAllFiles } from './get-all-files';
import { makeGetOneFile } from './get-one-file';

describe(
	'deleteOneFile()',
	integrationTestSpecDef(() => {
		let createOneFile: ReturnType<typeof makeCreateOneFile>;
		beforeAll(async () => {
			createOneFile = makeCreateOneFile(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneFile: ReturnType<typeof makeDeleteOneFile>;
		beforeAll(async () => {
			deleteOneFile = makeDeleteOneFile(await TEST_BASE_API_CONTEXT());
		});
		let getAllFiles: ReturnType<typeof makeGetAllFiles>;
		beforeAll(async () => {
			getAllFiles = makeGetAllFiles(await TEST_BASE_API_CONTEXT());
		});
		let getOneFile: ReturnType<typeof makeGetOneFile>;
		beforeAll(async () => {
			getOneFile = makeGetOneFile(await TEST_BASE_API_CONTEXT());
		});

		beforeEach(async () => {
			// Delete all files
			const currentFiles = await getAllFiles();
			const currentFileIDs = currentFiles.map(m => m.globalID); // !WARNING: gravwell/gravwell#2505
			const deletePromises = currentFileIDs.map(fileID => deleteOneFile(fileID));
			await Promise.all(deletePromises);

			// Create two files
			const creatableFiles: Array<CreatableFile> = [
				{
					name: 'F1',
					file: createReadStream(join(TEST_ASSETS_PATH!, 'file-a.txt')),
				},
				{
					name: 'F2',
					file: createReadStream(join(TEST_ASSETS_PATH!, 'auto-extractors.config')),
				},
			];
			const createPromises = creatableFiles.map(creatable => createOneFile(creatable));
			await Promise.all(createPromises);
		});

		it(
			'Should delete a file',
			integrationTest(async () => {
				const currentFiles = await getAllFiles();
				const currentFileIDs = currentFiles.map(m => m.globalID); // !WARNING: gravwell/gravwell#2505
				expect(currentFileIDs.length).toBe(2);

				const deleteFileID = currentFileIDs[0];
				assertIsNotNil(deleteFileID);
				await deleteOneFile(deleteFileID);
				await expectAsync(getOneFile(deleteFileID)).toBeRejected();

				const remainingFiles = await getAllFiles();
				const remainingFileIDs = remainingFiles.map(m => m.globalID); // !WARNING: gravwell/gravwell#2505
				expect(remainingFileIDs).not.toContain(deleteFileID);
				expect(remainingFileIDs.length).toBe(1);
			}),
		);
	}),
);

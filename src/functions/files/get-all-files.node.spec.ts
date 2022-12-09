/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { createReadStream } from 'fs';
import { join } from 'path';
import { CreatableFile, isFileMetadata } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_ASSETS_PATH, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneFile } from './create-one-file';
import { makeDeleteOneFile } from './delete-one-file';
import { makeGetAllFiles } from './get-all-files';

describe(
	'getAllFiles()',
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

		beforeEach(async () => {
			// Delete all files
			const currentFiles = await getAllFiles();
			const currentFileIDs = currentFiles.map(f => f.globalID); // !WARNING gravwell/gravwell#2505 can't use ThingUUID
			const deletePromises = currentFileIDs.map(fileID => deleteOneFile(fileID));
			await Promise.all(deletePromises);
		});

		it(
			'Should return all files',
			integrationTest(async () => {
				// Create two files
				const creatableFiles: Array<CreatableFile> = [
					{
						name: 'F1',
						file: createReadStream(join(TEST_ASSETS_PATH!, 'file-a.txt')),
					},
					{
						name: 'F2',
						file: createReadStream(join(TEST_ASSETS_PATH!, 'file-a.txt')),
					},
				];
				const createPromises = creatableFiles.map(creatable => createOneFile(creatable));
				await Promise.all(createPromises);
				const files = await getAllFiles();
				expect(files.length).toBe(2);
				expect(files.every(isFileMetadata)).toBeTrue();
			}),
		);

		it(
			'Should return an empty array if there are no files',
			integrationTest(async () => {
				const files = await getAllFiles();
				expect(files.length).toBe(0);
			}),
		);
	}),
);

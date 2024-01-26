/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { createReadStream, ReadStream } from 'fs';
import { omit } from 'lodash';
import { join } from 'path';
import { CreatableFile } from '~/models/file/creatable-file';
import { isFileMetadata } from '~/models/file/is-file-metadata';
import { TEST_ASSETS_PATH, TEST_BASE_API_CONTEXT } from '~/tests/config';
import { myCustomMatchers } from '~/tests/custom-matchers';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { NumericID } from '~/value-objects/id';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateOneFile } from './create-one-file';

describe(
	'createOneFile()',
	integrationTestSpecDef(() => {
		let createOneFile: ReturnType<typeof makeCreateOneFile>;
		beforeAll(async () => {
			createOneFile = makeCreateOneFile(await TEST_BASE_API_CONTEXT());
		});
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let deleteAllGroups: ReturnType<typeof makeDeleteAllGroups>;
		beforeAll(async () => {
			deleteAllGroups = makeDeleteAllGroups(await TEST_BASE_API_CONTEXT());
		});

		let groupIDs: Array<NumericID>;

		beforeEach(async () => {
			jasmine.addMatchers(myCustomMatchers);
			// avoid dup error from backend
			await deleteAllGroups();
			groupIDs = (
				await Promise.all(
					Array.from({ length: 3 })
						.map((_, i) => `G${i}`)
						.map(name => createOneGroup({ name })),
				)
			).map(g => g.id);
		});

		it(
			'Should create a file and return it',
			integrationTest(async () => {
				const createFileStream = (): ReadStream => createReadStream(join(TEST_ASSETS_PATH!, 'file-a.txt'));
				const fileStream = createFileStream();

				const data: CreatableFile = {
					groupIDs,
					isGlobal: true,

					name: 'name',
					description: 'description',
					labels: ['Label 1', 'Label 2'],

					file: fileStream as any,
				};

				const file = await createOneFile(data);
				expect(isFileMetadata(file)).toBeTrue();
				expect(file).toPartiallyEqual(omit(data, ['file']));
			}),
		);
	}),
);

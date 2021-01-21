/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { createReadStream } from 'fs';
import { join } from 'path';
import { CreatableFile, isFileMetadata } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_ASSETS_PATH, TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneFile } from './create-one-file';

describe('createOneFile()', () => {
	const createOneFile = makeCreateOneFile({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		groupIDs = await Promise.all(
			Array.from({ length: 3 })
				.map((_, i) => `G${i}`)
				.map(name => createOneGroup({ name })),
		);
	});

	it(
		'Should create a file and return it',
		integrationTest(async () => {
			const createFileStream = () => createReadStream(join(TEST_ASSETS_PATH!, 'file-a.txt'));
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

			const _data = { ...data };
			delete _data.file;
			expect(file).toPartiallyEqual(_data);
		}),
	);
});

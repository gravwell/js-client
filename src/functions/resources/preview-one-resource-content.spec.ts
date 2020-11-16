/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull } from 'lodash';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { UUID } from '../../value-objects';
import { CreatableResource, makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetOneResourceContent } from './get-one-resource-content';
import { makePreviewOneResourceContent } from './preview-one-resource-content';
import { makeSetOneResourceContent } from './set-one-resource-content';

describe('previewOneResource()', () => {
	const createOneResource = makeCreateOneResource({ host: TEST_HOST, useEncryption: false });
	const deleteOneResource = makeDeleteOneResource({ host: TEST_HOST, useEncryption: false });
	const previewOneResource = makePreviewOneResourceContent({ host: TEST_HOST, useEncryption: false });
	const setOneResourceContent = makeSetOneResourceContent({ host: TEST_HOST, useEncryption: false });
	const getOneResourceContent = makeGetOneResourceContent({ host: TEST_HOST, useEncryption: false });

	let createdResourceID: UUID;
	let createdResourceContent: string;

	beforeEach(async () => {
		const data: CreatableResource = {
			name: 'a name',
			description: 'a description',
		};
		createdResourceID = (await createOneResource(TEST_AUTH_TOKEN, data)).id;

		// Set the content
		const contentLength = 2048;
		createdResourceContent = ''.padEnd(contentLength, 'z');
		await setOneResourceContent(TEST_AUTH_TOKEN, createdResourceID, createdResourceContent as any);
	});

	afterEach(async () => {
		await deleteOneResource(TEST_AUTH_TOKEN, createdResourceID);
	});

	it(
		'Should return a preview of the resource content with the specified bytes',
		integrationTest(async () => {
			const tests = [256, 128, 127, 129, 64, null, 512, 1024, 2048];
			const originalResourceContent = await getOneResourceContent(TEST_AUTH_TOKEN, createdResourceID);
			expect(originalResourceContent).toBe(createdResourceContent);

			const testPromises = tests.map(async bytes => {
				const expectedBytes = isNull(bytes) ? 512 : bytes < 128 ? 512 : bytes;
				const expectedContent = createdResourceContent.substr(0, expectedBytes);
				const preview = await previewOneResource(TEST_AUTH_TOKEN, createdResourceID, { bytes: bytes ?? undefined });

				expect(preview.body.length).toBe(expectedBytes);
				expect(preview.body).toBe(expectedContent);
			});
			await Promise.all(testPromises);
		}),
	);
});

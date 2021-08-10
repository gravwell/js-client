/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull } from 'lodash';
import { CreatableResource } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { UUID } from '~/value-objects';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetOneResourceContent } from './get-one-resource-content';
import { makePreviewOneResourceContent } from './preview-one-resource-content';
import { makeSetOneResourceContent } from './set-one-resource-content';

describe('previewOneResource()', () => {
	const createOneResource = makeCreateOneResource(TEST_BASE_API_CONTEXT);
	const deleteOneResource = makeDeleteOneResource(TEST_BASE_API_CONTEXT);
	const previewOneResource = makePreviewOneResourceContent(TEST_BASE_API_CONTEXT);
	const setOneResourceContent = makeSetOneResourceContent(TEST_BASE_API_CONTEXT);
	const getOneResourceContent = makeGetOneResourceContent(TEST_BASE_API_CONTEXT);

	let createdResourceID: UUID;
	let createdResourceContent: string;

	beforeEach(async () => {
		const data: CreatableResource = {
			name: 'a name',
			description: 'a description',
		};
		createdResourceID = (await createOneResource(data)).id;

		// Set the content
		const contentLength = 2048;
		createdResourceContent = ''.padEnd(contentLength, 'z');
		await setOneResourceContent(createdResourceID, createdResourceContent as any);
	});

	afterEach(async () => {
		await deleteOneResource(createdResourceID);
	});

	it(
		'Should return a preview of the resource content with the specified bytes',
		integrationTest(async () => {
			const tests = [256, 128, 127, 129, 64, null, 512, 1024, 2048];
			const originalResourceContent = await getOneResourceContent(createdResourceID);
			expect(originalResourceContent).toBe(createdResourceContent);

			const testPromises = tests.map(async bytes => {
				const expectedBytes = isNull(bytes) ? 512 : bytes < 128 ? 512 : bytes;
				const expectedContent = createdResourceContent.substr(0, expectedBytes);
				const preview = await previewOneResource(createdResourceID, { bytes: bytes ?? undefined });

				expect(preview.body.length).toBe(expectedBytes);
				expect(preview.body).toBe(expectedContent);
			});
			await Promise.all(testPromises);
		}),
	);
});

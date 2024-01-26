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
import { CreatableResource } from '~/models/resource/creatable-resource';
import { isResource } from '~/models/resource/is-resource';
import { Resource } from '~/models/resource/resource';
import { TEST_ASSETS_PATH, TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneResource } from './create-one-resource';
import { makeDeleteOneResource } from './delete-one-resource';
import { makeGetOneResourceContent } from './get-one-resource-content';
import { makeSetOneResourceContent } from './set-one-resource-content';

describe(
	'setOneResourceContent()',
	integrationTestSpecDef(() => {
		let createOneResource: ReturnType<typeof makeCreateOneResource>;
		beforeAll(async () => {
			createOneResource = makeCreateOneResource(await TEST_BASE_API_CONTEXT());
		});
		let setOneResourceContent: ReturnType<typeof makeSetOneResourceContent>;
		beforeAll(async () => {
			setOneResourceContent = makeSetOneResourceContent(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneResource: ReturnType<typeof makeDeleteOneResource>;
		beforeAll(async () => {
			deleteOneResource = makeDeleteOneResource(await TEST_BASE_API_CONTEXT());
		});
		let getOneResourceContent: ReturnType<typeof makeGetOneResourceContent>;
		beforeAll(async () => {
			getOneResourceContent = makeGetOneResourceContent(await TEST_BASE_API_CONTEXT());
		});

		let createdResource: Resource;

		beforeEach(async () => {
			const data: CreatableResource = {
				name: 'name',
				description: 'description',
			};
			createdResource = await createOneResource(data);
		});

		afterEach(async () => {
			await deleteOneResource(createdResource.id);
		});

		it(
			'Should set the contents of an existing resource',
			integrationTest(async () => {
				const originalResourceContent = await getOneResourceContent(createdResource.id);

				const createFileStream = (): ReadStream => createReadStream(join(TEST_ASSETS_PATH!, 'file-a.txt'));
				const fileStream = createFileStream();
				const fileContentP = streamToString(createFileStream());

				const resource = await setOneResourceContent(createdResource.id, fileStream as any);
				const updatedResourceContent = await getOneResourceContent(createdResource.id);

				expect(isResource(resource)).toBeTrue();
				expect(originalResourceContent).not.toBe(updatedResourceContent);
				expect(createdResource.version + 1).toBe(resource.version);
				await expectAsync(fileContentP).toBeResolvedTo(updatedResourceContent);
			}),
			10000,
		);
	}),
);

const streamToString = (stream: ReadStream): Promise<string> => {
	const chunks: Array<Buffer> = [];
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk: Buffer) => chunks.push(chunk));
		stream.on('error', reject);
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	});
};

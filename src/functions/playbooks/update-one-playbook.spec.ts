/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omit } from 'lodash';
import { isPlaybook, Playbook } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { omitUndefinedShallow } from '../utils';
import { CreatablePlaybook, makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';
import { makeGetOnePlaybook } from './get-one-playbook';
import { makeUpdateOnePlaybook, UpdatablePlaybook } from './update-one-playbook';

describe('updateOnePlaybook()', () => {
	const createOnePlaybook = makeCreateOnePlaybook({ host: TEST_HOST, useEncryption: false });
	const getOnePlaybook = makeGetOnePlaybook({ host: TEST_HOST, useEncryption: false });
	const updateOnePlaybook = makeUpdateOnePlaybook({ host: TEST_HOST, useEncryption: false });
	const deleteOnePlaybook = makeDeleteOnePlaybook({ host: TEST_HOST, useEncryption: false });

	let createdPlaybook: Playbook;

	beforeEach(async () => {
		// Create one playbook
		const data: CreatablePlaybook = {
			name: 'Current name',
			description: 'Current description',
			body: 'This is my playbook',
		};
		const playbookUUID = await createOnePlaybook(TEST_AUTH_TOKEN, data);
		createdPlaybook = await getOnePlaybook(TEST_AUTH_TOKEN, playbookUUID);
	});

	afterEach(async () => {
		await deleteOnePlaybook(TEST_AUTH_TOKEN, createdPlaybook.uuid).catch(() => undefined);
	});

	const updateTests: Array<Omit<UpdatablePlaybook, 'uuid'>> = [
		{ name: 'New name' },
		{ description: 'New description' },
		{ description: null },

		{ userID: '2' },
		{ groupIDs: ['1'] },
		{ groupIDs: ['1', '2'] },
		{ groupIDs: [] },
		{ labels: [] },
		{ labels: ['test'] },

		{ isGlobal: true },
		{ isGlobal: false },

		{ body: 'This is a new body' },
		{ coverImageFileGUID: null },
		{ coverImageFileGUID: '8b0f4322-9653-4942-bd87-cf8ec966f6af' },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields: Array<string> = Object.keys(omit(_data, ['uuid']));
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		it(
			`Test ${formatedTestIndex}: Should update an playbook ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdPlaybook;
				expect(isPlaybook(current)).toBeTrue();

				const data: UpdatablePlaybook = { ..._data, uuid: current.uuid };
				const updated = await updateOnePlaybook(TEST_AUTH_TOKEN, data);
				expect(isPlaybook(updated)).toBeTrue();

				const parsedData = omitUndefinedShallow(data);
				expect(updated).toEqual({ ...current, ...parsedData, lastUpdateDate: updated.lastUpdateDate });
			}),
		);
	});
});

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omit } from 'lodash';
import { Actionable, ActionableAction, CreatableActionable, isActionable, UpdatableActionable } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { omitUndefinedShallow } from '../utils';
import { makeCreateOneActionable } from './create-one-actionable';
import { makeDeleteOneActionable } from './delete-one-actionable';
import { makeGetOneActionable } from './get-one-actionable';
import { makeUpdateOneActionable } from './update-one-actionable';

describe('updateOneActionable()', () => {
	const createOneActionable = makeCreateOneActionable(TEST_BASE_API_CONTEXT);
	const getOneActionable = makeGetOneActionable(TEST_BASE_API_CONTEXT);
	const updateOneActionable = makeUpdateOneActionable(TEST_BASE_API_CONTEXT);
	const deleteOneActionable = makeDeleteOneActionable(TEST_BASE_API_CONTEXT);

	let createdActionable: Actionable;

	beforeEach(async () => {
		// Create one actionable
		const data: CreatableActionable = {
			name: 'Current name',
			description: 'Current description',
			menuLabel: 'Current label',
			actions: [{ name: 'Current action', command: { type: 'query', userQuery: 'tag=netflow' } }],
			triggers: [{ pattern: /abc/g, activatesOn: 'clicks and selection' }],
		};
		createdActionable = await createOneActionable(data);
	});

	afterEach(async () => {
		await deleteOneActionable(createdActionable.uuid).catch(() => undefined);
	});

	const updateTests: Array<Omit<UpdatableActionable, 'uuid'>> = [
		{ name: 'New name' },
		{ description: 'New description' },
		{ description: null },
		{ menuLabel: 'New label' },
		{ menuLabel: null },

		{ userID: '2' },
		{ groupIDs: ['1'] },
		{ groupIDs: ['1', '2'] },
		{ groupIDs: [] },

		{ isGlobal: true },
		{ isGlobal: false },

		{ actions: [] },
		{
			actions: [
				{
					name: 'New action',
					description: 'New action description',
					command: { type: 'url', urlTemplate: 'http://google__VALUE__', modal: false, modalWidthPercentage: null },
				},
			],
		},

		{ triggers: [] },
		{ triggers: [{ pattern: /123/g, activatesOn: 'selection' }] },
	];
	updateTests.forEach((_data, testIndex) => {
		const updatedFields = Object.keys(omit(_data, ['uuid']));
		const formatedUpdatedFields = updatedFields.join(', ');
		const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

		// gravwell/gravwell#2425
		xit(
			`Test ${formatedTestIndex}: Should update an actionable ${formatedUpdatedFields} and return itself updated`,
			integrationTest(async () => {
				const current = createdActionable;
				expect(isActionable(current)).toBeTrue();

				const data: UpdatableActionable = { ..._data, uuid: current.uuid };
				if (updatedFields.includes('userID')) {
					// *NOTE: gravwell/gravwell#2318 nº 7
					await expectAsync(updateOneActionable(data)).toBeRejected();
					await expectAsync(getOneActionable(data.uuid)).toBeRejected();
					return;
				}

				const updated = await updateOneActionable(data);
				expect(isActionable(updated)).toBeTrue();

				const parsedData = omitUndefinedShallow({
					...data,
					actions: data.actions?.map<ActionableAction>(action => ({
						...action,
						description: action.description ?? null,
						placeholder: action.placeholder ?? null,
						start: action.start ?? { type: 'stringFormat', placeholder: null, format: null },
						end: action.end ?? { type: 'stringFormat', placeholder: null, format: null },
					})),
				});
				expect(updated).toEqual({ ...current, ...parsedData, lastUpdateDate: updated.lastUpdateDate });
			}),
		);
	});
});

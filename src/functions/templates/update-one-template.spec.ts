/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omit } from 'lodash';
import { CreatableTemplate, isTemplate, Template, TemplateVariable, UpdatableTemplate } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { omitUndefinedShallow } from '../utils';
import { makeCreateOneTemplate } from './create-one-template';
import { makeDeleteOneTemplate } from './delete-one-template';
import { makeUpdateOneTemplate } from './update-one-template';

describe(
	'updateOneTemplate()',
	integrationTestSpecDef(() => {
		let createOneTemplate: ReturnType<typeof makeCreateOneTemplate>;
		beforeAll(async () => {
			createOneTemplate = makeCreateOneTemplate(await TEST_BASE_API_CONTEXT());
		});
		let updateOneTemplate: ReturnType<typeof makeUpdateOneTemplate>;
		beforeAll(async () => {
			updateOneTemplate = makeUpdateOneTemplate(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneTemplate: ReturnType<typeof makeDeleteOneTemplate>;
		beforeAll(async () => {
			deleteOneTemplate = makeDeleteOneTemplate(await TEST_BASE_API_CONTEXT());
		});

		let createdTemplate: Template;

		beforeEach(async () => {
			// Create one template
			const data: CreatableTemplate = {
				name: 'Current name',
				description: 'Current description',
				query: 'tag=netflow __VAR__',
				variables: [{ label: 'Variable', name: '__VAR__', required: true }],
			};
			createdTemplate = await createOneTemplate(data);
		});

		afterEach(async () => {
			await deleteOneTemplate(createdTemplate.id).catch(() => undefined);
		});

		const testVariable: TemplateVariable = {
			label: 'New variable name',
			name: '__VAR__',
			previewValue: '',
			defaultValue: '',
			required: false,
			description: '',
		};

		const updateTests: Array<Omit<UpdatableTemplate, 'id'>> = [
			{ name: 'New name' },
			{ description: 'New description' },
			{ description: null },
			{ userID: '2' },
			{ groupIDs: ['1'] },
			{ groupIDs: ['1', '2'] },
			{ groupIDs: [] },
			{ isGlobal: true },
			{ isGlobal: false },
			{ query: 'tag=test __VAR__' },
			{ variables: [testVariable] },
			{ variables: [{ ...testVariable, description: 'New variable description' }] },
			{ variables: [{ ...testVariable, description: '' }] },
			{ variables: [{ ...testVariable, name: '__NEW_TOKEN__' }] },
			{ variables: [{ ...testVariable, previewValue: 'raw' }] },
			{ variables: [{ ...testVariable, previewValue: '' }] },
		];
		updateTests.forEach((_data, testIndex) => {
			const nestedObjectKeys: Array<keyof typeof _data> = ['variables'];
			const updatedFields: Array<string> = Object.keys(omit(_data, ['id'])).reduce<Array<string>>(
				(acc, key: string) => {
					const toAdd: Array<string> = nestedObjectKeys.includes(key as any)
						? Object.keys((_data as any)[key] as any).map(_k => `${key}.${_k}`)
						: [key];
					return acc.concat(toAdd);
				},
				[],
			);
			const formatedUpdatedFields = updatedFields.join(', ');
			const formatedTestIndex = (testIndex + 1).toString().padStart(2, '0');

			it(
				`Test ${formatedTestIndex}: Should update an template ${formatedUpdatedFields} and return itself updated`,
				integrationTest(async () => {
					const current = createdTemplate;
					expect(isTemplate(current)).toBeTrue();

					const data: UpdatableTemplate = { ..._data, id: current.id };

					const updated = await updateOneTemplate(data);
					expect(isTemplate(updated)).toBeTrue();

					const parsedData = omitUndefinedShallow({
						...data,
					});
					const obj = { ...current, ...parsedData, lastUpdateDate: updated.lastUpdateDate };
					expect(updated).toEqual(obj);
				}),
			);
		});
	}),
);

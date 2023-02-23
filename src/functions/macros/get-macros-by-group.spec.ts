/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { CreatableGroup, CreatableMacro, CreatableUser, isMacro, User } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeAddOneUserToManyGroups } from '../groups/add-one-user-to-many-groups';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneUser, makeGetMyUser } from '../users';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosByGroup } from './get-macros-by-group';

describe(
	'getMacrosByGroup()',
	integrationTestSpecDef(() => {
		let getAllMacros: ReturnType<typeof makeGetAllMacros>;
		beforeAll(async () => {
			getAllMacros = makeGetAllMacros(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let createOneMacro: ReturnType<typeof makeCreateOneMacro>;
		beforeAll(async () => {
			createOneMacro = makeCreateOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneMacro: ReturnType<typeof makeDeleteOneMacro>;
		beforeAll(async () => {
			deleteOneMacro = makeDeleteOneMacro(await TEST_BASE_API_CONTEXT());
		});
		let getMacrosByGroup: ReturnType<typeof makeGetMacrosByGroup>;
		beforeAll(async () => {
			getMacrosByGroup = makeGetMacrosByGroup(await TEST_BASE_API_CONTEXT());
		});
		let createOneGroup: ReturnType<typeof makeCreateOneGroup>;
		beforeAll(async () => {
			createOneGroup = makeCreateOneGroup(await TEST_BASE_API_CONTEXT());
		});
		let addOneUserToManyGroups: ReturnType<typeof makeAddOneUserToManyGroups>;
		beforeAll(async () => {
			addOneUserToManyGroups = makeAddOneUserToManyGroups(await TEST_BASE_API_CONTEXT());
		});
		let getMyUser: ReturnType<typeof makeGetMyUser>;
		beforeAll(async () => {
			getMyUser = makeGetMyUser(await TEST_BASE_API_CONTEXT());
		});

		let admin: User;
		let adminGroupID: string;

		let analyst: User;
		let analystAuth: string;
		let analystGroupID: string;

		beforeEach(async () => {
			// Get admin
			admin = await getMyUser();

			// Creates an analyst
			const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
			const data: CreatableUser = {
				name: 'Test',
				email: userSeed + '@example.com',
				password: 'changeme',
				role: 'analyst',
				username: userSeed,
			};
			analyst = await createOneUser(data);
			analystAuth = await login(analyst.username, data.password);

			// Creates two groups
			const creatableGroups: Array<CreatableGroup> = [{ name: 'Admin' }, { name: 'Analyst' }];
			const groupCreationPs = creatableGroups.map(data => createOneGroup(data));
			const groups = await Promise.all(groupCreationPs);
			const [id0, id1] = groups.map(g => g.id);
			assertIsNotNil(id0);
			assertIsNotNil(id1);
			[adminGroupID, analystGroupID] = [id0, id1];

			// Assign admin to one group and analyst to the other
			await Promise.all([
				addOneUserToManyGroups(admin.id, [adminGroupID]),
				addOneUserToManyGroups(analyst.id, [analystGroupID]),
			]);

			// Delete all macros
			const currentMacros = await getAllMacros();
			const currentMacroIDs = currentMacros.map(m => m.id);
			const deletePromises = currentMacroIDs.map(macroID => deleteOneMacro(macroID));
			await Promise.all(deletePromises);

			// Create two macros for the admin group
			const creatableMacros: Array<CreatableMacro> = [
				{ name: 'M1', expansion: 'abc', groupIDs: [adminGroupID] },
				{ name: 'M2', expansion: 'def', groupIDs: [adminGroupID] },
			];
			const createPromises = creatableMacros.map(creatable => createOneMacro(creatable));
			await Promise.all(createPromises);

			// Create three macros for the analyst group
			const creatableMacros2: Array<CreatableMacro> = [
				{ name: 'M3', expansion: 'abc', groupIDs: [analystGroupID] },
				{ name: 'M4', expansion: 'def', groupIDs: [analystGroupID] },
				{ name: 'M5', expansion: 'ghi', groupIDs: [analystGroupID] },
			];

			const createOneMacroAsAnalyst = makeCreateOneMacro({
				...(await TEST_BASE_API_CONTEXT()),
				authToken: analystAuth,
			});

			const createPromises2 = creatableMacros2.map(creatable => createOneMacroAsAnalyst(creatable));
			await Promise.all(createPromises2);
		});

		xit(
			'Should return all macros of a group',
			integrationTest(async () => {
				const allMacros = await getAllMacros();
				const allMacroIDs = allMacros.map(m => m.id);
				const adminMacroIDs = allMacros.filter(m => m.userID === admin.id).map(m => m.id);
				const analystMacroIDs = allMacros.filter(m => m.userID === analyst.id).map(m => m.id);

				expect(allMacroIDs.length).toBe(5);
				expect(adminMacroIDs.length).toBe(2);
				expect(analystMacroIDs.length).toBe(3);

				const adminGroupMacros = await getMacrosByGroup(adminGroupID);
				expect(adminGroupMacros.length).toBe(adminMacroIDs.length);
				expect(adminGroupMacros.every(isMacro)).toBeTrue();
				expect(adminGroupMacros.map(m => m.id).sort()).toEqual(adminMacroIDs.sort());

				const analystGroupMacros = await getMacrosByGroup(analystGroupID);
				expect(analystGroupMacros.length).toBe(analystMacroIDs.length);
				expect(analystGroupMacros.every(isMacro)).toBeTrue();
				expect(analystGroupMacros.map(m => m.id).sort()).toEqual(analystMacroIDs.sort());
			}),
		);

		xit(
			'Should return an empty array if the group has no macros',
			integrationTest(async () => {
				const creatableGroup: CreatableGroup = { name: 'New' };
				const group = await createOneGroup(creatableGroup);
				const macros = await getMacrosByGroup(group.id);
				expect(macros.length).toBe(0);
			}),
		);

		xit(
			"Blocks non admin users from grabbing macros from other groups that they don't belong",
			integrationTest(async () => {
				await expectAsync(getMacrosByGroup(adminGroupID)).toBeResolved();
				await expectAsync(getMacrosByGroup(analystGroupID)).toBeResolved();

				const getMacrosByGroupAsAnalyst = makeGetMacrosByGroup({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: analystAuth,
				});

				await expectAsync(getMacrosByGroupAsAnalyst(adminGroupID)).toBeRejected();
				await expectAsync(getMacrosByGroupAsAnalyst(analystGroupID)).toBeResolved();
			}),
		);
	}),
);

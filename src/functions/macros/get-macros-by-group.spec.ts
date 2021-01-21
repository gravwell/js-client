/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableGroup, CreatableMacro, CreatableUser, isMacro, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeAddOneUserToManyGroups } from '../groups/add-one-user-to-many-groups';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneUser, makeGetMyUser, makeGetOneUser } from '../users';
import { makeCreateOneMacro } from './create-one-macro';
import { makeDeleteOneMacro } from './delete-one-macro';
import { makeGetAllMacros } from './get-all-macros';
import { makeGetMacrosByGroup } from './get-macros-by-group';

describe('getMacrosByGroup()', () => {
	const getAllMacros = makeGetAllMacros(TEST_BASE_API_CONTEXT);
	const getOneUser = makeGetOneUser(TEST_BASE_API_CONTEXT);
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);
	const createOneMacro = makeCreateOneMacro(TEST_BASE_API_CONTEXT);
	const deleteOneMacro = makeDeleteOneMacro(TEST_BASE_API_CONTEXT);
	const getMacrosByGroup = makeGetMacrosByGroup(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const addOneUserToManyGroups = makeAddOneUserToManyGroups(TEST_BASE_API_CONTEXT);
	const getMyUser = makeGetMyUser(TEST_BASE_API_CONTEXT);

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
			user: userSeed,
		};
		const userID = await createOneUser(data);
		analyst = await getOneUser(userID);
		analystAuth = await login(analyst.username, data.password);

		// Creates two groups
		const creatableGroups: Array<CreatableGroup> = [{ name: 'Admin' }, { name: 'Analyst' }];
		const groupCreationPs = creatableGroups.map(data => createOneGroup(data));
		[adminGroupID, analystGroupID] = await Promise.all(groupCreationPs);

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
			...TEST_BASE_API_CONTEXT,
			authToken: analystAuth,
		});

		const createPromises2 = creatableMacros2.map(creatable => createOneMacroAsAnalyst(creatable));
		await Promise.all(createPromises2);
	});

	it(
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

	it(
		'Should return an empty array if the group has no macros',
		integrationTest(async () => {
			const creatableGroup: CreatableGroup = { name: 'New' };
			const groupID = await createOneGroup(creatableGroup);
			const macros = await getMacrosByGroup(groupID);
			expect(macros.length).toBe(0);
		}),
	);

	it(
		"Blocks non admin users from grabbing macros from other groups that they don't belong",
		integrationTest(async () => {
			await expectAsync(getMacrosByGroup(adminGroupID)).toBeResolved();
			await expectAsync(getMacrosByGroup(analystGroupID)).toBeResolved();

			const getMacrosByGroupAsAnalyst = makeGetMacrosByGroup({
				...TEST_BASE_API_CONTEXT,
				authToken: analystAuth,
			});

			await expectAsync(getMacrosByGroupAsAnalyst(adminGroupID)).toBeRejected();
			await expectAsync(getMacrosByGroupAsAnalyst(analystGroupID)).toBeResolved();
		}),
	);
});

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableDashboard, CreatableGroup, CreatableUser, isDashboard, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeAddOneUserToManyGroups } from '../groups/add-one-user-to-many-groups';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneUser, makeGetMyUser, makeGetOneUser } from '../users';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsByGroup } from './get-dashboards-by-group';

xdescribe('getDashboardsByGroup()', () => {
	const getAllDashboards = makeGetAllDashboards({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneDashboard = makeCreateOneDashboard({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteOneDashboard = makeDeleteOneDashboard({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getDashboardsByGroup = makeGetDashboardsByGroup({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const addOneUserToManyGroups = makeAddOneUserToManyGroups({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getMyUser = makeGetMyUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	let admin: User;
	const adminAuth = TEST_AUTH_TOKEN;
	let adminGroupID: string;

	let analyst: User;
	let analystAuth: string;
	let analystGroupID: string;

	beforeEach(async () => {
		// Get admin
		admin = await getMyUser(adminAuth);

		// Creates an analyst
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		const userID = await createOneUser(adminAuth, data);
		analyst = await getOneUser(adminAuth, userID);
		analystAuth = await login(analyst.username, data.password);

		// Creates two groups
		const creatableGroups: Array<CreatableGroup> = [{ name: 'Admin' }, { name: 'Analyst' }];
		const groupCreationPs = creatableGroups.map(data => createOneGroup(adminAuth, data));
		[adminGroupID, analystGroupID] = await Promise.all(groupCreationPs);

		// Assign admin to one group and analyst to the other
		await Promise.all([
			addOneUserToManyGroups(adminAuth, admin.id, [adminGroupID]),
			addOneUserToManyGroups(adminAuth, analyst.id, [analystGroupID]),
		]);

		// Delete all dashboards
		const currentDashboards = await getAllDashboards(adminAuth);
		const currentDashboardIDs = currentDashboards.map(m => m.id);
		const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(adminAuth, dashboardID));
		await Promise.all(deletePromises);

		// Create two dashboards for the admin group
		const creatableDashboards: Array<CreatableDashboard> = [
			{
				name: 'D1',
				groupIDs: [adminGroupID],
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
			{
				name: 'D2',
				groupIDs: [adminGroupID],
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
		];
		const createPromises = creatableDashboards.map(creatable => createOneDashboard(adminAuth, creatable));
		await Promise.all(createPromises);

		// Create three dashboards for the analyst group
		const creatableDashboards2: Array<CreatableDashboard> = [
			{
				name: 'D3',
				groupIDs: [analystGroupID],
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
			{
				name: 'D4',
				groupIDs: [analystGroupID],
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
			{
				name: 'D5',
				groupIDs: [analystGroupID],
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
		];
		const createPromises2 = creatableDashboards2.map(creatable => createOneDashboard(analystAuth, creatable));
		await Promise.all(createPromises2);
	});

	it(
		'Should return all dashboards of a group',
		integrationTest(async () => {
			const allDashboards = await getAllDashboards(adminAuth);
			const allDashboardIDs = allDashboards.map(m => m.id);
			const adminDashboardIDs = allDashboards.filter(m => m.userID === admin.id).map(m => m.id);
			const analystDashboardIDs = allDashboards.filter(m => m.userID === analyst.id).map(m => m.id);

			expect(allDashboardIDs.length).toBe(5);
			expect(adminDashboardIDs.length).toBe(2);
			expect(analystDashboardIDs.length).toBe(3);

			const adminGroupDashboards = await getDashboardsByGroup(adminAuth, adminGroupID);
			expect(adminGroupDashboards.length).toBe(adminDashboardIDs.length);
			expect(adminGroupDashboards.every(isDashboard)).toBeTrue();
			expect(adminGroupDashboards.map(m => m.id).sort()).toEqual(adminDashboardIDs.sort());

			const analystGroupDashboards = await getDashboardsByGroup(adminAuth, analystGroupID);
			expect(analystGroupDashboards.length).toBe(analystDashboardIDs.length);
			expect(analystGroupDashboards.every(isDashboard)).toBeTrue();
			expect(analystGroupDashboards.map(m => m.id).sort()).toEqual(analystDashboardIDs.sort());
		}),
	);

	it(
		'Should return an empty array if the group has no dashboards',
		integrationTest(async () => {
			const creatableGroup: CreatableGroup = { name: 'New' };
			const groupID = await createOneGroup(adminAuth, creatableGroup);
			const dashboards = await getDashboardsByGroup(groupID);
			expect(dashboards.length).toBe(0);
		}),
	);

	it(
		"Blocks non admin users from grabbing dashboards from other groups that they don't belong",
		integrationTest(async () => {
			await expectAsync(getDashboardsByGroup(adminAuth, adminGroupID)).toBeResolved();
			await expectAsync(getDashboardsByGroup(adminAuth, analystGroupID)).toBeResolved();

			await expectAsync(getDashboardsByGroup(analystAuth, adminGroupID)).toBeRejected();
			await expectAsync(getDashboardsByGroup(analystAuth, analystGroupID)).toBeResolved();
		}),
	);
});

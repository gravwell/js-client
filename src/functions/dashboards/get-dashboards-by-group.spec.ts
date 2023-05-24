/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { CreatableDashboard, CreatableGroup, CreatableUser, isDashboard, User } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeAddOneUserToManyGroups } from '../groups/add-one-user-to-many-groups';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneUser, makeGetMyUser } from '../users';
import { assertIsNotNil } from '../utils/type-guards';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsByGroup } from './get-dashboards-by-group';

xdescribe(
	'getDashboardsByGroup()',
	integrationTestSpecDef(() => {
		let getAllDashboards: ReturnType<typeof makeGetAllDashboards>;
		beforeAll(async () => {
			getAllDashboards = makeGetAllDashboards(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let createOneDashboard: ReturnType<typeof makeCreateOneDashboard>;
		beforeAll(async () => {
			createOneDashboard = makeCreateOneDashboard(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneDashboard: ReturnType<typeof makeDeleteOneDashboard>;
		beforeAll(async () => {
			deleteOneDashboard = makeDeleteOneDashboard(await TEST_BASE_API_CONTEXT());
		});
		let getDashboardsByGroup: ReturnType<typeof makeGetDashboardsByGroup>;
		beforeAll(async () => {
			getDashboardsByGroup = makeGetDashboardsByGroup(await TEST_BASE_API_CONTEXT());
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
			const groupCreationPs = creatableGroups.map(dataMap => createOneGroup(dataMap));
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

			// Delete all dashboards
			const currentDashboards = await getAllDashboards();
			const currentDashboardIDs = currentDashboards.map(m => m.id);
			const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(dashboardID));
			await Promise.all(deletePromises);

			// Create two dashboards for the admin group
			const creatableDashboards: Array<CreatableDashboard> = [
				{
					name: 'D1',
					groupIDs: [adminGroupID],
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
				{
					name: 'D2',
					groupIDs: [adminGroupID],
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
			];
			const createPromises = creatableDashboards.map(creatable => createOneDashboard(creatable));
			await Promise.all(createPromises);

			// Create three dashboards for the analyst group
			const creatableDashboards2: Array<CreatableDashboard> = [
				{
					name: 'D3',
					groupIDs: [analystGroupID],
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
				{
					name: 'D4',
					groupIDs: [analystGroupID],
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
				{
					name: 'D5',
					groupIDs: [analystGroupID],
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
			];

			const createOneDashboardAsAnalyst = makeCreateOneDashboard({
				...(await TEST_BASE_API_CONTEXT()),
				authToken: analystAuth,
			});

			const createPromises2 = creatableDashboards2.map(creatable => createOneDashboardAsAnalyst(creatable));
			await Promise.all(createPromises2);
		});

		it(
			'Should return all dashboards of a group',
			integrationTest(async () => {
				const allDashboards = await getAllDashboards();
				const allDashboardIDs = allDashboards.map(m => m.id);
				const adminDashboardIDs = allDashboards.filter(m => m.userID === admin.id).map(m => m.id);
				const analystDashboardIDs = allDashboards.filter(m => m.userID === analyst.id).map(m => m.id);

				expect(allDashboardIDs.length).toBe(5);
				expect(adminDashboardIDs.length).toBe(2);
				expect(analystDashboardIDs.length).toBe(3);

				const adminGroupDashboards = await getDashboardsByGroup(adminGroupID);
				expect(adminGroupDashboards.length).toBe(adminDashboardIDs.length);
				expect(adminGroupDashboards.every(isDashboard)).toBeTrue();
				expect(adminGroupDashboards.map(m => m.id).sort()).toEqual(adminDashboardIDs.sort());

				const analystGroupDashboards = await getDashboardsByGroup(analystGroupID);
				expect(analystGroupDashboards.length).toBe(analystDashboardIDs.length);
				expect(analystGroupDashboards.every(isDashboard)).toBeTrue();
				expect(analystGroupDashboards.map(m => m.id).sort()).toEqual(analystDashboardIDs.sort());
			}),
		);

		it(
			'Should return an empty array if the group has no dashboards',
			integrationTest(async () => {
				const creatableGroup: CreatableGroup = { name: 'New' };
				const group = await createOneGroup(creatableGroup);
				const dashboards = await getDashboardsByGroup(group.id);
				expect(dashboards.length).toBe(0);
			}),
		);

		it(
			"Blocks non admin users from grabbing dashboards from other groups that they don't belong",
			integrationTest(async () => {
				await expectAsync(getDashboardsByGroup(adminGroupID)).toBeResolved();
				await expectAsync(getDashboardsByGroup(analystGroupID)).toBeResolved();

				const getDashboardsByGroupAsAnalyst = makeGetDashboardsByGroup({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: analystAuth,
				});

				await expectAsync(getDashboardsByGroupAsAnalyst(adminGroupID)).toBeRejected();
				await expectAsync(getDashboardsByGroupAsAnalyst(analystGroupID)).toBeResolved();
			}),
		);
	}),
);

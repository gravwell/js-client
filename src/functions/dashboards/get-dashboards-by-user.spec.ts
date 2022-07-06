/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableDashboard, CreatableUser, isDashboard, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsByUser } from './get-dashboards-by-user';

describe('getDashboardsByUser()', () => {
	const getAllDashboards = makeGetAllDashboards(TEST_BASE_API_CONTEXT);
	const getDashboardsByUser = makeGetDashboardsByUser(TEST_BASE_API_CONTEXT);
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);
	const createOneDashboard = makeCreateOneDashboard(TEST_BASE_API_CONTEXT);
	const deleteOneDashboard = makeDeleteOneDashboard(TEST_BASE_API_CONTEXT);

	let user: User;
	let userAuth: string;

	beforeEach(async () => {
		// Delete all dashboards
		const currentDashboards = await getAllDashboards();
		const currentDashboardIDs = currentDashboards.map(m => m.id);
		const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(dashboardID));
		await Promise.all(deletePromises);

		// Create two dashboards as admin
		const creatableDashboards1: Array<CreatableDashboard> = [
			{
				name: 'D1',
				searches: [],
				tiles: [],
				timeframe: {
					durationString: 'PT1H',
					end: null,
					start: null,
					timeframe: 'PT1H',
					timezone: null,
				},
			},
			{
				name: 'D2',
				searches: [],
				tiles: [],
				timeframe: {
					durationString: 'PT1H',
					end: null,
					start: null,
					timeframe: 'PT1H',
					timezone: null,
				},
			},
		];
		const createPromises1 = creatableDashboards1.map(creatable => createOneDashboard(creatable));
		await Promise.all(createPromises1);

		// Creates a user
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		user = await createOneUser(data);
		userAuth = await login(user.username, data.password);

		// Create three dashboards as analyst
		const creatableDashboards2: Array<CreatableDashboard> = [
			{
				name: 'D3',
				searches: [],
				tiles: [],
				timeframe: {
					durationString: 'PT1H',
					end: null,
					start: null,
					timeframe: 'PT1H',
					timezone: null,
				},
			},
			{
				name: 'D4',
				searches: [],
				tiles: [],
				timeframe: {
					durationString: 'PT1H',
					end: null,
					start: null,
					timeframe: 'PT1H',
					timezone: null,
				},
			},
			{
				name: 'D5',
				searches: [],
				tiles: [],
				timeframe: {
					durationString: 'PT1H',
					end: null,
					start: null,
					timeframe: 'PT1H',
					timezone: null,
				},
			},
		];

		const createOneDashboardAsAnalyst = makeCreateOneDashboard({
			...TEST_BASE_API_CONTEXT,
			authToken: userAuth,
		});

		const createPromises2 = creatableDashboards2.map(creatable => createOneDashboardAsAnalyst(creatable));
		await Promise.all(createPromises2);
	});

	xit(
		'Should return all dashboards of a user',
		integrationTest(async () => {
			const allDashboards = await getAllDashboards();
			const allDashboardIDs = allDashboards.map(m => m.id);
			const analystDashboardIDs = allDashboards.filter(m => m.userID === user.id).map(m => m.id);

			expect(allDashboardIDs.length).toBe(5);
			expect(analystDashboardIDs.length).toBe(3);

			const dashboards = await getDashboardsByUser(user.id);
			expect(dashboards.length).toBe(analystDashboardIDs.length);
			expect(dashboards.every(isDashboard)).toBeTrue();
			expect(dashboards.map(m => m.id).sort()).toEqual(analystDashboardIDs.sort());
		}),
	);

	xit(
		'Should return an empty array if the user has no dashboards',
		integrationTest(async () => {
			// Delete all dashboards
			const currentDashboards = await getAllDashboards();
			const currentDashboardIDs = currentDashboards.map(m => m.id);
			const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(dashboardID));
			await Promise.all(deletePromises);

			const dashboards = await getDashboardsByUser(user.id);
			expect(dashboards.length).toBe(0);
		}),
	);

	xit(
		'Blocks non admin users from grabbing dashboards from other users other than themselves',
		integrationTest(async () => {
			const allDashboards = await getAllDashboards();
			const allDashboardIDs = allDashboards.map(m => m.id);
			const analystDashboardIDs = allDashboards.filter(m => m.userID === user.id).map(m => m.id);
			const adminID = allDashboards.filter(m => m.userID !== user.id)[0].userID;

			expect(allDashboardIDs.length).toBe(5);
			expect(analystDashboardIDs.length).toBe(3);

			const getDashboardsByUserAsAnalyst = makeGetDashboardsByUser({
				...TEST_BASE_API_CONTEXT,
				authToken: userAuth,
			});

			const dashboardsSelf = await getDashboardsByUserAsAnalyst(user.id);
			expect(dashboardsSelf.length).toBe(analystDashboardIDs.length);
			expect(dashboardsSelf.every(isDashboard)).toBeTrue();
			expect(dashboardsSelf.map(m => m.id).sort()).toEqual(analystDashboardIDs.sort());

			await expectAsync(getDashboardsByUserAsAnalyst(adminID)).toBeRejected();
		}),
	);
});

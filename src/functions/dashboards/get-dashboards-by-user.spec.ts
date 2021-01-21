/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableDashboard, CreatableUser, isDashboard, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsByUser } from './get-dashboards-by-user';

describe('getDashboardsByUser()', () => {
	const getAllDashboards = makeGetAllDashboards({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getDashboardsByUser = makeGetDashboardsByUser({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
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
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
			{
				name: 'D2',
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
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
		const userID = await createOneUser(data);
		user = await getOneUser(userID);
		userAuth = await login(user.username, data.password);

		// Create three dashboards as analyst
		const creatableDashboards2: Array<CreatableDashboard> = [
			{
				name: 'D3',
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
			{
				name: 'D4',
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
			{
				name: 'D5',
				searches: [],
				tiles: [],
				timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
			},
		];
		const createPromises2 = creatableDashboards2.map(creatable => createOneDashboard(userAuth, creatable));
		await Promise.all(createPromises2);
	});

	it(
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

	it(
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

	it(
		'Blocks non admin users from grabbing dashboards from other users other than themselves',
		integrationTest(async () => {
			const allDashboards = await getAllDashboards();
			const allDashboardIDs = allDashboards.map(m => m.id);
			const analystDashboardIDs = allDashboards.filter(m => m.userID === user.id).map(m => m.id);
			const adminID = allDashboards.filter(m => m.userID !== user.id)[0].userID;

			expect(allDashboardIDs.length).toBe(5);
			expect(analystDashboardIDs.length).toBe(3);

			const dashboardsSelf = await getDashboardsByUser(userAuth, user.id);
			expect(dashboardsSelf.length).toBe(analystDashboardIDs.length);
			expect(dashboardsSelf.every(isDashboard)).toBeTrue();
			expect(dashboardsSelf.map(m => m.id).sort()).toEqual(analystDashboardIDs.sort());

			await expectAsync(getDashboardsByUser(userAuth, adminID)).toBeRejected();
		}),
	);
});

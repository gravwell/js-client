/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { CreatableDashboard, Dashboard, isDashboard, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { CreatableUser, makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsAuthorizedToMe } from './get-dashboards-authorized-to-me';

describe('getDashboardsAuthorizedToMe()', () => {
	const getDashboardsAuthorizedToMe = makeGetDashboardsAuthorizedToMe({ host: TEST_HOST, useEncryption: false });
	const createOneDashboard = makeCreateOneDashboard({ host: TEST_HOST, useEncryption: false });
	const deleteOneDashboard = makeDeleteOneDashboard({ host: TEST_HOST, useEncryption: false });
	const getAllDashboards = makeGetAllDashboards({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false });

	let adminDashboards: Array<Dashboard>;

	let analyst: User;
	let analystAuth: string;
	let analystDashboards: Array<Dashboard>;

	beforeEach(async () => {
		// Delete all dashboards
		const currentDashboards = await getAllDashboards(TEST_AUTH_TOKEN);
		const currentDashboardIDs = currentDashboards.map(m => m.id);
		const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(TEST_AUTH_TOKEN, dashboardID));
		await Promise.all(deletePromises);

		// Create two dashboards as admin
		const creatableDashboards: Array<CreatableDashboard> = [
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
		const createPromises = creatableDashboards.map(creatable => createOneDashboard(TEST_AUTH_TOKEN, creatable));
		adminDashboards = await Promise.all(createPromises);

		// Creates an analyst
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		const userID = await createOneUser(TEST_AUTH_TOKEN, data);
		analyst = await getOneUser(TEST_AUTH_TOKEN, userID);
		analystAuth = await login(analyst.username, data.password);

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
		const createPromises2 = creatableDashboards2.map(creatable => createOneDashboard(analystAuth, creatable));
		analystDashboards = await Promise.all(createPromises2);
	});

	it(
		'Returns all my dashboards',
		integrationTest(async () => {
			const actualAdminDashboards = await getDashboardsAuthorizedToMe(TEST_AUTH_TOKEN);
			expect(sortBy(actualAdminDashboards, m => m.id)).toEqual(sortBy(adminDashboards, m => m.id));
			for (const dashboard of actualAdminDashboards) expect(isDashboard(dashboard)).toBeTrue();

			const actualAnalystDashboards = await getDashboardsAuthorizedToMe(analystAuth);
			expect(sortBy(actualAnalystDashboards, m => m.id)).toEqual(sortBy(analystDashboards, m => m.id));
			for (const dashboard of actualAnalystDashboards) expect(isDashboard(dashboard)).toBeTrue();

			const allDashboards = await getAllDashboards(TEST_AUTH_TOKEN);
			expect(sortBy(allDashboards, m => m.id)).toEqual(sortBy([...analystDashboards, ...adminDashboards], m => m.id));
			for (const dashboard of allDashboards) expect(isDashboard(dashboard)).toBeTrue();
		}),
	);
});

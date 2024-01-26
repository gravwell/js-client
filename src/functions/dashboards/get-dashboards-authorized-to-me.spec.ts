/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random, sortBy } from 'lodash';
import { CreatableDashboard } from '~/models/dashboard/creatable-dashboard';
import { Dashboard } from '~/models/dashboard/dashboard';
import { isDashboard } from '~/models/dashboard/is-dashboard';
import { CreatableUser } from '~/models/user/creatable-user';
import { User } from '~/models/user/user';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users/create-one-user';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsAuthorizedToMe } from './get-dashboards-authorized-to-me';

describe(
	'getDashboardsAuthorizedToMe()',
	integrationTestSpecDef(() => {
		let getDashboardsAuthorizedToMe: ReturnType<typeof makeGetDashboardsAuthorizedToMe>;
		beforeAll(async () => {
			getDashboardsAuthorizedToMe = makeGetDashboardsAuthorizedToMe(await TEST_BASE_API_CONTEXT());
		});
		let createOneDashboard: ReturnType<typeof makeCreateOneDashboard>;
		beforeAll(async () => {
			createOneDashboard = makeCreateOneDashboard(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneDashboard: ReturnType<typeof makeDeleteOneDashboard>;
		beforeAll(async () => {
			deleteOneDashboard = makeDeleteOneDashboard(await TEST_BASE_API_CONTEXT());
		});
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

		let adminDashboards: Array<Dashboard>;

		let analyst: User;
		let analystAuth: string;
		let analystDashboards: Array<Dashboard>;

		beforeEach(async () => {
			// Delete all dashboards
			const currentDashboards = await getAllDashboards();
			const currentDashboardIDs = currentDashboards.map(m => m.id);
			const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(dashboardID));
			await Promise.all(deletePromises);

			// Create two dashboards as admin
			const creatableDashboards: Array<CreatableDashboard> = [
				{
					name: 'D1',
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
				{
					name: 'D2',
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
			];
			const createPromises = creatableDashboards.map(creatable => createOneDashboard(creatable));
			adminDashboards = await Promise.all(createPromises);

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

			// Create three dashboards as analyst
			const creatableDashboards2: Array<CreatableDashboard> = [
				{
					name: 'D3',
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
				{
					name: 'D4',
					searches: [],
					tiles: [],
					timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H', timezone: null },
				},
				{
					name: 'D5',
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
			analystDashboards = await Promise.all(createPromises2);
		});

		xit(
			'Returns all my dashboards',
			integrationTest(async () => {
				const actualAdminDashboards = await getDashboardsAuthorizedToMe();
				expect(sortBy(actualAdminDashboards, m => m.id)).toEqual(sortBy(adminDashboards, m => m.id));
				for (const dashboard of actualAdminDashboards) {
					expect(isDashboard(dashboard)).toBeTrue();
				}

				const getDashboardsAuthorizedToAnalyst = makeGetDashboardsAuthorizedToMe({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: analystAuth,
				});

				const actualAnalystDashboards = await getDashboardsAuthorizedToAnalyst();
				expect(sortBy(actualAnalystDashboards, m => m.id)).toEqual(sortBy(analystDashboards, m => m.id));
				for (const dashboard of actualAnalystDashboards) {
					expect(isDashboard(dashboard)).toBeTrue();
				}

				const allDashboards = await getAllDashboards();
				expect(sortBy(allDashboards, m => m.id)).toEqual(sortBy([...analystDashboards, ...adminDashboards], m => m.id));
				for (const dashboard of allDashboards) {
					expect(isDashboard(dashboard)).toBeTrue();
				}
			}),
		);
	}),
);

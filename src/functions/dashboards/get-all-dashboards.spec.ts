/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableDashboard } from '~/models/dashboard/creatable-dashboard';
import { isDashboard } from '~/models/dashboard/is-dashboard';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, integrationTestSpecDef } from '~/tests/test-types';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';

describe(
	'getAllDashboards()',
	integrationTestSpecDef(() => {
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

		beforeEach(async () => {
			// Delete all dashboards
			const currentDashboards = await getAllDashboards();
			const currentDashboardIDs = currentDashboards.map(m => m.id);
			const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(dashboardID));
			await Promise.all(deletePromises);
		});

		it(
			'Should return all dashboards',
			integrationTest(async () => {
				// Create two dashboards
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
				await Promise.all(createPromises);

				const dashboards = await getAllDashboards();
				expect(dashboards.length).toBe(2);
				expect(dashboards.every(isDashboard)).toBeTrue();
			}),
		);

		it(
			'Should return an empty array if there are no dashboards',
			integrationTest(async () => {
				const dashboards = await getAllDashboards();
				expect(dashboards.length).toBe(0);
			}),
		);
	}),
);

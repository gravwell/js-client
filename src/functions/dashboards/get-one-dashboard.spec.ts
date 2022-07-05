/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableDashboard, Dashboard, isDashboard } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetOneDashboard } from './get-one-dashboard';

describe('getOneDashboard()', () => {
	const getOneDashboard = makeGetOneDashboard(TEST_BASE_API_CONTEXT);
	const createOneDashboard = makeCreateOneDashboard(TEST_BASE_API_CONTEXT);
	const getAllDashboards = makeGetAllDashboards(TEST_BASE_API_CONTEXT);
	const deleteOneDashboard = makeDeleteOneDashboard(TEST_BASE_API_CONTEXT);

	let createdDashboard: Dashboard;

	beforeEach(async () => {
		// Delete all dashboards
		const currentDashboards = await getAllDashboards();
		const currentDashboardIDs = currentDashboards.map(m => m.id);
		const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(dashboardID));
		await Promise.all(deletePromises);

		// Create on dashboard
		const data: CreatableDashboard = {
			name: 'TEST',
			searches: [],
			tiles: [],
			timeframe: {
				durationString: 'PT1H',
				end: null,
				start: null,
				timeframe: 'PT1H',
				timezone: null,
			},
		};
		createdDashboard = await createOneDashboard(data);
	});

	it(
		'Returns a dashboard',
		integrationTest(async () => {
			const dashboard = await getOneDashboard(createdDashboard.id);
			expect(isDashboard(dashboard)).toBeTrue();
			expect(dashboard).toEqual(createdDashboard);
		}),
	);

	it(
		"Returns an error if the dashboard doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneDashboard('non-existent')).toBeRejected();
		}),
	);
});

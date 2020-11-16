/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableDashboard, Dashboard, isDashboard } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetOneDashboard } from './get-one-dashboard';

describe('getOneDashboard()', () => {
	const getOneDashboard = makeGetOneDashboard({ host: TEST_HOST, useEncryption: false });
	const createOneDashboard = makeCreateOneDashboard({ host: TEST_HOST, useEncryption: false });
	const getAllDashboards = makeGetAllDashboards({ host: TEST_HOST, useEncryption: false });
	const deleteOneDashboard = makeDeleteOneDashboard({ host: TEST_HOST, useEncryption: false });

	let createdDashboard: Dashboard;

	beforeEach(async () => {
		// Delete all dashboards
		const currentDashboards = await getAllDashboards(TEST_AUTH_TOKEN);
		const currentDashboardIDs = currentDashboards.map(m => m.id);
		const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(TEST_AUTH_TOKEN, dashboardID));
		await Promise.all(deletePromises);

		// Create on dashboard
		const data: CreatableDashboard = {
			name: 'TEST',
			searches: [],
			tiles: [],
			timeframe: { durationString: 'PT1H', end: null, start: null, timeframe: 'PT1H' },
		};
		createdDashboard = await createOneDashboard(TEST_AUTH_TOKEN, data);
	});

	it(
		'Returns a dashboard',
		integrationTest(async () => {
			const dashboard = await getOneDashboard(TEST_AUTH_TOKEN, createdDashboard.id);
			expect(isDashboard(dashboard)).toBeTrue();
			expect(dashboard).toEqual(createdDashboard);
		}),
	);

	it(
		"Returns an error if the dashboard doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneDashboard(TEST_AUTH_TOKEN, 'non-existent')).toBeRejected();
		}),
	);
});

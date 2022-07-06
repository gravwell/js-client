/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableDashboard } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneDashboard } from './create-one-dashboard';
import { makeDeleteOneDashboard } from './delete-one-dashboard';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetOneDashboard } from './get-one-dashboard';

describe('deleteOneDashboard()', () => {
	const createOneDashboard = makeCreateOneDashboard(TEST_BASE_API_CONTEXT);
	const deleteOneDashboard = makeDeleteOneDashboard(TEST_BASE_API_CONTEXT);
	const getAllDashboards = makeGetAllDashboards(TEST_BASE_API_CONTEXT);
	const getOneDashboard = makeGetOneDashboard(TEST_BASE_API_CONTEXT);

	beforeEach(async () => {
		// Delete all dashboards
		const currentDashboards = await getAllDashboards();
		const currentDashboardIDs = currentDashboards.map(m => m.id);
		const deletePromises = currentDashboardIDs.map(dashboardID => deleteOneDashboard(dashboardID));
		await Promise.all(deletePromises);

		// Create two dashboards
		const creatableDashboards: Array<CreatableDashboard> = [
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
		const createPromises = creatableDashboards.map(creatable => createOneDashboard(creatable));
		await Promise.all(createPromises);
	});

	it(
		'Should delete a dashboard',
		integrationTest(async () => {
			const currentDashboards = await getAllDashboards();
			const currentDashboardIDs = currentDashboards.map(m => m.id);
			expect(currentDashboardIDs.length).toBe(2);

			const deleteDashboardID = currentDashboardIDs[0];
			await deleteOneDashboard(deleteDashboardID);
			await expectAsync(getOneDashboard(deleteDashboardID)).toBeRejected();

			const remainingDashboards = await getAllDashboards();
			const remainingDashboardIDs = remainingDashboards.map(m => m.id);
			expect(remainingDashboardIDs).not.toContain(deleteDashboardID);
			expect(remainingDashboardIDs.length).toBe(1);
		}),
	);
});

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableDashboard, isDashboard } from '~/models';
import { integrationTest, myCustomMatchers, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeDeleteAllGroups } from '../groups/delete-all-groups';
import { makeCreateOneDashboard } from './create-one-dashboard';

describe('createOneDashboard()', () => {
	const createOneDashboard = makeCreateOneDashboard(TEST_BASE_API_CONTEXT);
	const createOneGroup = makeCreateOneGroup(TEST_BASE_API_CONTEXT);
	const deleteAllGroups = makeDeleteAllGroups(TEST_BASE_API_CONTEXT);

	// let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		await deleteAllGroups();

		// groupIDs =
		await Promise.all(
			Array.from({ length: 3 })
				.map((_, i) => `G${i}`)
				.map(name => createOneGroup({ name })),
		);
	});

	it(
		'Should create a dashboard and return it',
		integrationTest(async () => {
			const data: CreatableDashboard = {
				name: 'name',
				description: 'description',
				labels: ['Label 1', 'Label 2'],
				// TODO: gravwell/gravwell#2453
				groupIDs: [],

				liveUpdate: { enabled: true, interval: 10 },
				gridOptions: { gutter: 32, margin: 2 },
				updateOnZoom: true,

				searches: [{ name: 'Search 1', type: 'query', query: 'tag=netflow' }],
				tiles: [
					{
						title: 'Tile 1',
						renderer: 'overview',
						dimensions: { columns: 4, rows: 4 },
						position: { x: 0, y: 0 },
						searchIndex: 0,
					},
				],
				timeframe: {
					durationString: 'PT1H',
					end: null,
					start: null,
					timeframe: 'PT1H',
					timezone: null,
				},
			};

			const dashboard = await createOneDashboard(data);
			expect(isDashboard(dashboard)).toBeTrue();
			expect(dashboard).toPartiallyEqual(data);
		}),
	);
});

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { omitUndefinedShallow } from '~/functions/utils';
import { toRawNumericID } from '~/value-objects';
import { toRawTimeframe } from '../timeframe';
import { CreatableDashboard } from './creatable-dashboard';
import { RawCreatableDashboard } from './raw-creatable-dashboard';
import { toRawCreatableDashboardSearch } from './to-raw-creatable-dashboard-search';
import { toRawCreatableDashboardTile } from './to-raw-creatable-dashboard-tile';

export const toRawCreatableDashboard = (creatable: CreatableDashboard): RawCreatableDashboard => ({
	GIDs: creatable.groupIDs?.map(toRawNumericID) ?? [],
	Global: creatable.isGlobal ?? false,

	Name: creatable.name.trim(),
	Description: creatable.description?.trim() ?? null,
	Labels: creatable.labels ?? [],

	Data: omitUndefinedShallow({
		timeframe: toRawTimeframe(creatable.timeframe),
		searches: creatable.searches.map(toRawCreatableDashboardSearch),
		tiles: creatable.tiles.map(toRawCreatableDashboardTile),

		liveUpdateInterval: creatable.liveUpdate?.interval ?? undefined,
		linkZooming: creatable.updateOnZoom ?? false,
		grid: (() => {
			if (isUndefined(creatable.gridOptions)) return undefined;
			return omitUndefinedShallow({
				gutter: creatable.gridOptions?.gutter ?? undefined,
				margin: creatable.gridOptions?.margin ?? undefined,
			});
		})(),
		version: 2,
	}),
});

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
import { Dashboard } from './dashboard';
import { RawUpdatableDashboard } from './raw-updatable-dashboard';
import { toRawCreatableDashboardSearch } from './to-raw-creatable-dashboard-search';
import { UpdatableDashboard } from './updatable-dashboard';

export const toRawUpdatableDashboard = (updatable: UpdatableDashboard, current: Dashboard): RawUpdatableDashboard => ({
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),
	Global: updatable.isGlobal ?? current.isGlobal,

	Name: updatable.name ?? current.name,
	Description: (isUndefined(updatable.description) ? current.description : updatable.description) ?? '',
	Labels: updatable.labels ?? current.labels,

	Data: {
		timeframe: updatable.timeframe
			? toRawTimeframe(updatable.timeframe)
			: current.timeframe
			? toRawTimeframe(current.timeframe)
			: undefined,

		searches: (updatable.searches ?? current.searches).map(toRawCreatableDashboardSearch),

		tiles: (updatable.tiles ?? current.tiles).map(t => ({
			/** Legacy support: `id` may be undefined. */
			id: t.id ? toRawNumericID(t.id) : undefined,
			title: t.title,
			renderer: t.renderer,
			span: {
				col: t.dimensions.columns,
				row: t.dimensions.rows,
				x: t.position.x ?? undefined,
				y: t.position.y ?? undefined,
			},
			searchesIndex: t.searchIndex,
			rendererOptions: t.rendererOptions ?? undefined,
		})),

		liveUpdateInterval: (updatable.liveUpdate ?? current.liveUpdate).interval ?? undefined,
		linkZooming: updatable.updateOnZoom ?? current.updateOnZoom,
		grid: (() => {
			const gridOptions = { ...current.gridOptions, ...(updatable.gridOptions ?? {}) };
			return omitUndefinedShallow({
				gutter: gridOptions.gutter ?? undefined,
				margin: gridOptions.margin ?? undefined,
			});
		})(),
		version: updatable.version?.major ?? current.version.major,
	},
});

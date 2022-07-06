/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil, isNumber, isString, isUndefined } from 'lodash';
import { DATA_TYPE } from '~/models';
import { toNumericID } from '~/value-objects';
import { RawTimeframe, toTimeframe } from '../timeframe';
import { toVersion } from '../version';
import { Dashboard } from './dashboard';
import { BaseDashboardSearch, DashboardSearch } from './dashboard-search';
import { RawDashboard } from './raw-dashboard';

const DASHBOARD_DEFAULT_VERSION = '2.0.0';

export const toDashboard = (raw: RawDashboard): Dashboard => ({
	_tag: DATA_TYPE.DASHBOARD,

	id: toNumericID(raw.ID),
	globalID: raw.GUID ?? null,

	userID: toNumericID(raw.UID),
	groupIDs: (raw.GIDs ?? []).map(toNumericID),
	isGlobal: raw.Global ?? false,

	name: raw.Name,
	description: raw.Description.trim() === '' ? null : raw.Description.trim(),
	labels: raw.Labels ?? [],

	creationDate: new Date(raw.Created),
	lastUpdateDate: new Date(raw.Updated),
	lastMainUpdateDate: new Date(raw.Data.lastDataUpdate ?? raw.Updated),

	version: toVersion(raw.Data.version?.toString() ?? DASHBOARD_DEFAULT_VERSION),
	updateOnZoom: raw.Data.linkZooming ?? false,

	gridOptions: {
		gutter:
			!isNil(raw.Data.grid) && !isNil(raw.Data.grid.gutter) ? parseInt(raw.Data.grid.gutter.toString(), 10) : null,
		margin:
			!isNil(raw.Data.grid) && !isNil(raw.Data.grid.margin) ? parseInt(raw.Data.grid.margin.toString(), 10) : null,
	},

	liveUpdate:
		isNumber(raw.Data.liveUpdateInterval) && raw.Data.liveUpdateInterval > 0
			? { enabled: true, interval: raw.Data.liveUpdateInterval }
			: { enabled: false },

	timeframe: raw.Data.timeframe ? toTimeframe(raw.Data.timeframe) : undefined,

	tiles: (raw.Data.tiles ?? []).map(t => ({
		/** Legacy support: `id` may be undefined. */
		id: t.id ? toNumericID(t.id) : undefined,
		title: t.title,

		searchIndex: t.searchesIndex,

		renderer: t.renderer,
		rendererOptions: t.rendererOptions ?? null,

		dimensions: {
			columns: t.span.col,
			rows: t.span.row,
		},
		position: {
			x: t.span.x ?? null,
			y: t.span.y ?? null,
		},
	})),

	searches: (raw.Data.searches ?? []).map<DashboardSearch>(s => {
		const base: BaseDashboardSearch = {
			name: s.alias,
			timeframeOverride: Object.keys(s.timeframe ?? {}).length === 0 ? null : toTimeframe(<RawTimeframe>s.timeframe),
			cachedSearchID: s.searchID?.toString() ?? null,
			variablePreviewValue: s.reference?.extras?.defaultValue ?? null,
			color: s.color ?? null,
		};

		if (isString(s.query)) return { ...base, type: 'query', query: s.query };

		if (isUndefined(s.reference)) throw Error('Unexpected reference === undefined');
		const reference = s.reference;
		switch (reference.type) {
			case 'template':
				return { ...base, type: 'template', templateID: reference.id };
			case 'savedQuery':
				return { ...base, type: 'savedQuery', savedQueryID: reference.id };
			case 'scheduledSearch':
				return { ...base, type: 'scheduledSearch', scheduledSearchID: reference.id };
		}
	}),
});

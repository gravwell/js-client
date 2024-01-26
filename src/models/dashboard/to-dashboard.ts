/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil, isNumber, isString } from 'lodash';
import { DATA_TYPE } from '~/models/data-type';
import { toVersion } from '~/models/version/to-version';
import { toNumericID } from '~/value-objects/id';
import { omitUndefinedShallow } from '../../functions/utils/omit-undefined-shallow';
import { RawTimeframe } from '../timeframe/raw-timeframe';
import { toTimeframe } from '../timeframe/to-timeframe';
import { Dashboard } from './dashboard';
import { BaseDashboardSearch, DashboardSearch } from './dashboard-search';
import { DashboardTile } from './dashboard-tile';
import { RawDashboard } from './raw-dashboard';
import { RawDashboardSearch } from './raw-dashboard-search';
import { RawDashboardTile } from './raw-dashboard-tile';

const DASHBOARD_DEFAULT_VERSION = '2.0.0';

export const toDashboard = (raw: RawDashboard): Dashboard =>
	omitUndefinedShallow({
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

			borderRadius: raw.Data.grid?.borderRadius ?? null,
			borderWidth: raw.Data.grid?.borderWidth ?? null,
		},

		liveUpdate:
			isNumber(raw.Data.liveUpdateInterval) && raw.Data.liveUpdateInterval > 0
				? { enabled: true, interval: raw.Data.liveUpdateInterval }
				: { enabled: false },

		timeframe: raw.Data.timeframe ? toTimeframe(raw.Data.timeframe) : undefined,

		tiles: (raw.Data.tiles ?? []).map(toDashboardTile),

		searches: (raw.Data.searches ?? []).map<DashboardSearch>(toDashboardSearch),
	});

export const toDashboardTile = (t: RawDashboardTile): DashboardTile =>
	omitUndefinedShallow({
		/** Legacy support: `id` may be undefined. */
		id: toNumericID(t.id ?? Date.now()),
		title: t.title,
		hideZoom: t.hideZoom ?? true,

		searchIndex: t.searchesIndex,

		renderer: t.renderer,
		rendererOptions: t.rendererOptions ?? {},

		dimensions: {
			columns: t.span?.col ?? 0,
			rows: t.span?.row ?? 0,
		},
		position: {
			x: t.span?.x ?? 0,
			y: t.span?.y ?? 0,
		},
	});

export const toDashboardSearch = (s: RawDashboardSearch): DashboardSearch => {
	const base: BaseDashboardSearch = {
		name: s.alias,
		timeframeOverride: Object.keys(s.timeframe ?? {}).length === 0 ? null : toTimeframe(s.timeframe as RawTimeframe),
		cachedSearchID: s.searchID?.toString() ?? null,
		variablePreviewValue: s.reference?.extras?.defaultValue ?? null,
		color: s.color ?? null,
	};

	if (isString(s.query)) {
		return { ...base, type: 'query', query: s.query };
	}

	if (isNil(s.reference)) {
		return { ...base, type: 'legacy', ...omitUndefinedShallow(s) };
	}

	const reference = s.reference;
	switch (reference.type) {
		case 'template':
			return { ...base, type: 'template', templateID: reference.id };
		case 'savedQuery':
			return { ...base, type: 'savedQuery', savedQueryID: reference.id };
		case 'scheduledSearch':
			return { ...base, type: 'scheduledSearch', scheduledSearchID: reference.id };
	}
};

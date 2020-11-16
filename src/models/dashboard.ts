/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil, isNull, isNumber, isString, isUndefined, random } from 'lodash';
import { omitUndefinedShallow, PartialProps } from '../functions/utils';
import { isNumericID, NumericID, RawNumericID, RawUUID, toNumericID, toRawNumericID, UUID } from '../value-objects';
import { CreatableTimeframe, isTimeframe, RawTimeframe, Timeframe, toRawTimeframe, toTimeframe } from './timeframe';
import { toVersion, Version } from './version';

export interface Dashboard {
	id: NumericID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	name: string;
	description: string | null;
	labels: Array<string>;

	creationDate: Date;
	lastUpdateDate: Date;
	/**
	 * Date of the last update to the dashboard contents, not including name,
	 * description, labels, userID and groupIDs
	 */
	lastMainUpdateDate: Date;

	version: Version;

	/**
	 * Update all tiles when zooming.
	 */
	updateOnZoom: boolean;

	liveUpdate: DashboardLiveUpdate;

	timeframe: Timeframe;

	searches: Array<DashboardSearch>;

	tiles: Array<DashboardTile>;

	gridOptions: {
		gutter: number | null;
		margin: number | null;
	};
}

export type DashboardLiveUpdate = { enabled: true; interval: number } | { enabled: false; interval?: null };

export interface DashboardTile {
	id: NumericID;
	title: string;

	/**
	 * Index for the related search in Dashboard.searches.
	 */
	searchIndex: number;

	renderer: string;
	rendererOptions: RendererOptions;

	dimensions: {
		columns: number;
		rows: number;
	};
	position: {
		x: number;
		y: number;
	};
}

export interface RendererOptions {
	XAxisSplitLine?: 'no';
	YAxisSplitLine?: 'no';
	IncludeOther?: 'yes';
	Stack?: 'grouped' | 'stacked';
	Smoothing?: 'normal' | 'smooth';
	Orientation?: 'v' | 'h';
	ConnectNulls?: 'no' | 'yes';
	Precision?: 'no';
	LogScale?: 'no';
	Range?: 'no';
	Rotate?: 'yes';
	Labels?: 'no';
	Background?: 'no';
	values?: {
		Smoothing?: 'smooth';
		Orientation?: 'h';
		columns?: Array<string>;
	};
}

export interface BaseDashboardSearch {
	name: string | null;
	timeframeOverride: Timeframe | null;
	cachedSearchID: NumericID | null;
	variablePreviewValue: string | null;
}

export type DashboardSearch = BaseDashboardSearch &
	(
		| { type: 'query'; query: string }
		| { type: 'template'; templateID: UUID }
		| { type: 'savedQuery'; savedQueryID: UUID }
		| { type: 'scheduledSearch'; scheduledSearchID: UUID }
	);

export const isDashboardSearch = (value: any): value is DashboardSearch => {
	try {
		const ds = <DashboardSearch>value;
		return (
			(isString(ds.name) || isNull(ds.name)) &&
			(isTimeframe(ds.timeframeOverride) || isNull(ds.timeframeOverride)) &&
			(isNumericID(ds.cachedSearchID) || isNull(ds.cachedSearchID)) &&
			(isString(ds.variablePreviewValue) || isNull(ds.variablePreviewValue))
		);
	} catch {
		return false;
	}
};

export interface RawDashboard {
	ID: RawNumericID;
	GUID: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;

	Name: string;
	Description: string; // empty string is null
	Labels: Array<string> | null;

	Created: string; // Timestamp
	Updated: string; // Timestamp

	Data: {
		liveUpdateInterval?: number; // 0 is undefined
		linkZooming?: boolean;

		grid?: {
			gutter?: string | number | null; // string is a number
			margin?: string | number | null; // string is a number
		};

		searches: Array<{
			alias: string | null;
			timeframe?: {} | RawTimeframe;
			query?: string;
			searchID?: RawNumericID;
			reference?: {
				id: RawUUID;
				type: 'template' | 'savedQuery' | 'scheduledSearch';
				extras?: {
					defaultValue: string | null;
				};
			};
		}>;
		tiles: Array<{
			id: RawNumericID;
			title: string;
			renderer: string;
			span: { col: number; row: number; x: number; y: number };
			searchesIndex: number;
			rendererOptions: RendererOptions;
		}>;
		timeframe: RawTimeframe;
		version?: 1 | 2;
		lastDataUpdate?: string; // Timestamp
	};
}

const DASHBOARD_DEFAULT_VERSION = '2.0.0';

export const toDashboard = (raw: RawDashboard): Dashboard => ({
	id: toNumericID(raw.ID),
	globalID: raw.GUID,

	userID: toNumericID(raw.UID),
	groupIDs: (raw.GIDs ?? []).map(toNumericID),

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

	timeframe: toTimeframe(raw.Data.timeframe),

	tiles: raw.Data.tiles.map(t => ({
		id: toNumericID(t.id),
		title: t.title,

		searchIndex: t.searchesIndex,

		renderer: t.renderer,
		rendererOptions: t.rendererOptions,

		dimensions: {
			columns: t.span.col,
			rows: t.span.row,
		},
		position: {
			x: t.span.x,
			y: t.span.y,
		},
	})),

	searches: raw.Data.searches.map<DashboardSearch>(s => {
		const base: BaseDashboardSearch = {
			name: s.alias,
			timeframeOverride: Object.keys(s.timeframe ?? {}).length === 0 ? null : toTimeframe(<RawTimeframe>s.timeframe),
			cachedSearchID: s.searchID?.toString() ?? null,
			variablePreviewValue: s.reference?.extras?.defaultValue ?? null,
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

export const isDashboard = (value: any): value is Dashboard => {
	try {
		const d = <Dashboard>value;
		return isNumericID(d.id);
	} catch {
		return false;
	}
};

export type CreatableDashboardSearch = Partial<BaseDashboardSearch> &
	(
		| { type: 'query'; query: string }
		| { type: 'template'; templateID: UUID }
		| { type: 'savedQuery'; savedQueryID: UUID }
		| { type: 'scheduledSearch'; scheduledSearchID: UUID }
	);

export type CreatableDashboardTile = PartialProps<Omit<DashboardTile, 'id'>, 'rendererOptions'>;

export interface CreatableDashboard {
	groupIDs?: Array<NumericID>;

	/**
	 * All uppercase and no spaces.
	 */
	name: string;
	description?: string | null;
	labels?: Array<string>;

	timeframe: CreatableTimeframe;
	searches: Array<CreatableDashboardSearch>;
	tiles: Array<CreatableDashboardTile>;

	updateOnZoom?: boolean;

	liveUpdate?: DashboardLiveUpdate;

	gridOptions?: {
		gutter?: number | null;
		margin?: number | null;
	};
}

type RawCreatableDashboardSearch = RawCreatableDashboard['Data']['searches'][number];

type RawCreatableDashboardTile = RawCreatableDashboard['Data']['tiles'][number];

interface RawCreatableDashboard {
	GIDs: Array<RawNumericID>;

	Name: string;
	Description: string | null;
	Labels: Array<string>;

	Data: {
		liveUpdateInterval?: number; // 0 is undefined
		linkZooming?: boolean;

		grid?: {
			gutter?: number;
			margin?: number;
		};

		searches: Array<{
			alias: string | null;
			timeframe?: RawTimeframe;
			query?: string;
			searchID?: RawNumericID;
			reference?: {
				id: RawUUID;
				type: 'template' | 'savedQuery' | 'scheduledSearch';
				extras?: {
					defaultValue: string | null;
				};
			};
		}>;
		tiles: Array<{
			id: RawNumericID;
			title: string;
			renderer: string;
			span: { col: number; row: number; x: number; y: number };
			searchesIndex: number;
			rendererOptions: RendererOptions;
		}>;
		timeframe: RawTimeframe;
		version: 2;
	};
}

export const toRawCreatableDashboardSearch = (data: CreatableDashboardSearch): RawCreatableDashboardSearch =>
	omitUndefinedShallow({
		alias: data.name ?? null,
		timeframe: data.timeframeOverride ? toRawTimeframe(data.timeframeOverride) : undefined,
		query: data.type === 'query' ? data.query : undefined,
		searchID: isNumericID(data.cachedSearchID) ? toRawNumericID(data.cachedSearchID) : undefined,
		reference: ((): RawCreatableDashboardSearch['reference'] => {
			if (data.type === 'query') return undefined;

			const extras = { defaultValue: data.variablePreviewValue ?? null };
			switch (data.type) {
				case 'template':
					return { id: data.templateID, type: 'template', extras };
				case 'savedQuery':
					return { id: data.savedQueryID, type: 'savedQuery', extras };
				case 'scheduledSearch':
					return { id: data.scheduledSearchID, type: 'scheduledSearch', extras };
			}
		})(),
	});

export const toRawCreatableDashboardTile = (data: CreatableDashboardTile): RawCreatableDashboardTile => ({
	id: random(0, Number.MAX_SAFE_INTEGER),
	title: data.title,
	renderer: data.renderer,
	span: { col: data.dimensions.columns, row: data.dimensions.rows, x: data.position.x, y: data.position.y },
	searchesIndex: data.searchIndex,
	rendererOptions: data.rendererOptions ?? {},
});

export const toRawCreatableDashboard = (creatable: CreatableDashboard): RawCreatableDashboard => ({
	GIDs: creatable.groupIDs?.map(toRawNumericID) ?? [],

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

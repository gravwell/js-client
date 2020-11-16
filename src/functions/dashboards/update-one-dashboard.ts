/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import {
	CreatableDashboardSearch,
	CreatableTimeframe,
	Dashboard,
	DashboardLiveUpdate,
	DashboardTile,
	RawDashboard,
	RawTimeframe,
	RendererOptions,
	toDashboard,
	toRawCreatableDashboardSearch,
	toRawTimeframe,
	Version,
} from '../../models';
import { NumericID, RawNumericID, RawUUID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';
import { makeGetOneDashboard } from './get-one-dashboard';

export const makeUpdateOneDashboard = (makerOptions: APIFunctionMakerOptions) => {
	const getOneDashboard = makeGetOneDashboard(makerOptions);

	return async (authToken: string | null, data: UpdatableDashboard): Promise<Dashboard> => {
		const templatePath = '/api/dashboards/{dashboardID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { dashboardID: data.id } });

		try {
			const current = await getOneDashboard(authToken, data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableDashboard(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawDashboard = await parseJSONResponse<RawDashboard>(raw);
			return toDashboard(rawDashboard);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableDashboard {
	id: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	version?: Version;
	timeframe?: CreatableTimeframe;
	searches?: Array<CreatableDashboardSearch>;
	tiles?: Array<DashboardTile>;

	updateOnZoom?: boolean;

	liveUpdate?: DashboardLiveUpdate;

	gridOptions?: {
		gutter?: number | null;
		margin?: number | null;
	};
}

interface RawUpdatableDashboard {
	GIDs: Array<RawNumericID>;

	Name: string;
	Description: string; // Use empty string for null
	Labels: Array<string>;

	Data: {
		liveUpdateInterval?: number; // 0 is undefined
		linkZooming?: boolean;

		grid?: {
			gutter?: number; // string is a number
			margin?: number; // string is a number
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
		version?: number;
		lastDataUpdate?: string; // Timestamp
	};
}

const toRawUpdatableDashboard = (updatable: UpdatableDashboard, current: Dashboard): RawUpdatableDashboard => ({
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

	Name: updatable.name ?? current.name,
	Description: (isUndefined(updatable.description) ? current.description : updatable.description) ?? '',
	Labels: updatable.labels ?? current.labels,

	Data: {
		timeframe: toRawTimeframe(updatable.timeframe ?? current.timeframe),

		searches: (updatable.searches ?? current.searches).map(toRawCreatableDashboardSearch),

		tiles: (updatable.tiles ?? current.tiles).map(t => ({
			id: toRawNumericID(t.id),
			title: t.title,
			renderer: t.renderer,
			span: { col: t.dimensions.columns, row: t.dimensions.rows, x: t.position.x, y: t.position.y },
			searchesIndex: t.searchIndex,
			rendererOptions: t.rendererOptions,
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

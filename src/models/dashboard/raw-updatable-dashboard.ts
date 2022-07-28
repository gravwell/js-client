/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';
import { RawTimeframe } from '../timeframe';
import { DashboardRendererOptions } from './dashboard-renderer-options';

export interface RawUpdatableDashboard {
	GIDs: Array<RawNumericID>;
	Global: boolean;

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
			/** Legacy support: `id` may be undefined. */
			id?: RawNumericID;
			title: string;
			renderer: string;
			/**	Due to the old dashboards we may not have `x` and `y` defined */
			span: { col: number; row: number; x?: number; y?: number };
			/** `string` included for legacy dashboard support. */
			searchesIndex: number | string;
			/**	Due to the old dashboards we may not have `.rendererOptions` defined */
			rendererOptions?: DashboardRendererOptions;
		}>;
		/** Legacy support: `timeframe` may be undefined. */
		timeframe?: RawTimeframe;
		version?: number;
		lastDataUpdate?: string; // Timestamp
	};
}

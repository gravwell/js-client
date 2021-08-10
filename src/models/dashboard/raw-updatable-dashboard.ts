/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
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
			rendererOptions: DashboardRendererOptions;
		}>;
		timeframe: RawTimeframe;
		version?: number;
		lastDataUpdate?: string; // Timestamp
	};
}

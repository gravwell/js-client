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
			color?: string;
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
		version?: 1 | 2;
		lastDataUpdate?: string; // Timestamp
	};
}

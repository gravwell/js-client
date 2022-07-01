/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';
import { RawTimeframe } from '../timeframe';
import { RawDashboardSearch } from './raw-dashboard-search';
import { RawDashboardTile } from './raw-dashboard-tile';

export interface RawDashboard {
	ID: RawNumericID;
	GUID?: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;
	Global: boolean;

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

		/** Legacy support: `searches`, `tiles`, and/or `timeframe` may be undefined. */
		searches?: Array<RawDashboardSearch>;
		tiles?: Array<RawDashboardTile>;
		timeframe?: RawTimeframe;
		version?: 1 | 2;
		lastDataUpdate?: string; // Timestamp
	};
}

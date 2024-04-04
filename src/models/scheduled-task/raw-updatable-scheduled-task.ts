/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '~/value-objects/id';

export interface RawUpdatableScheduledTask {
	Groups: Array<RawNumericID>;
	Global: boolean;

	Name: string;
	Description: string;
	Labels: Array<string>;

	OneShot: boolean;
	Disabled: boolean;

	Timezone: string; //empty string is null
	Schedule: string; // cron job format

	// *START - Standard search properties
	SearchString: string; //empty string is null
	Duration: number; // In seconds, displayed in the GUI as human friendly "Timeframe"
	SearchSinceLastRun: boolean;
	// *END - Standard search properties

	// *START - Script search properties
	Script: string; // empty string is null
	DebugMode: boolean;
	// *END - Script search properties

	// NOTE: Required for scheduled searches. Not applicable to scripts.
	TimeframeOffset?: number;
	BackfillEnabled?: boolean;

	// Scheduled searches only.
	SearchReference?: string | undefined;

	// Scheduled searches only.
	WriteAccess: {
		Global: boolean;
		GIDs?: Array<RawNumericID> | null;
	};
}

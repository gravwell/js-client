/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID } from '~/value-objects';

export interface RawCreatableScheduledTask {
	Groups: Array<RawNumericID>;
	Global: boolean;

	Name: string;
	Description: string;
	Labels: Array<string>;

	OneShot: boolean;
	Disabled: boolean;

	Schedule: string; // cron job format
	Timezone: string; // empty string is null

	// *START - Standard search properties
	SearchString?: string; //empty string is null
	Duration?: number; // In seconds, displayed in the GUI as a human friendly "Timeframe"
	SearchSinceLastRun?: boolean;
	// *END - Standard search properties

	// *START - Script search properties
	Script?: string; // empty string is null
	DebugMode: boolean;
	// *END - Script search properties
}

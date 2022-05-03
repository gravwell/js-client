/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface Timeframe {
	durationString: string | null;
	timeframe: string | null;
	timezone: string | null;
	start: Date | null;
	end: Date | null;
}

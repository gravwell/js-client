/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

export interface RawTimeframe {
	durationString?: string | null;
	timeframe?: string | null;
	timezone?: string | null;
	start?: string | null; // Timestamp
	end?: string | null; // Timestamp
}

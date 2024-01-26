/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '../../value-objects/id';
import { RawQuery } from '../query';
import { RawTimeframe } from '../timeframe/raw-timeframe';

export interface RawSearchDetails {
	ID: string;
	UID: RawNumericID;
	GID?: RawNumericID;

	UserQuery: RawQuery;
	EffectiveQuery: RawQuery;

	Preview: boolean;
	StartRange: string; // timestamp
	EndRange: string; // timestamp

	Started: string; // timestamp
	LastUpdate: string; // timestamp
	Duration: string; // eg. "0s" or "150.21ms"

	CollapsingIndex: number;
	Descending: boolean;
	IndexSize: number;
	ItemCount: number;
	Metadata?: {
		timeframe: RawTimeframe | null;
		live: boolean;
		timeframeUserLabel: null;
		name?: string;
		notes?: string;
	};
	MinZoomWindow?: number;
	NoHistory: boolean;
	RenderDownloadFormats: Array<string>;
	StoreSize: number; // integer
	TimeZoomDisabled: boolean;
	Tags: Array<string>;

	Import: {
		Imported: boolean;
		Time: string; // timestamp
		BatchName: string;
		BatchInfo: string;
	};
	Error?: string;
}

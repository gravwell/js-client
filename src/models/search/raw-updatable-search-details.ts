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

import { RawNumericID } from '../../value-objects';
import { RawQuery } from '../query';
import { RawTimeframe } from '../timeframe';

export interface RawUpdatableSearchDetails {
	GID?: RawNumericID | null;

	UserQuery: RawQuery;
	EffectiveQuery: RawQuery;

	Preview: boolean;
	StartRange: Date; // timestamp
	EndRange: Date; // timestamp

	LastUpdate: Date; // timestamp
	Duration: Date; // eg. "0s" or "150.21ms"

	Descending: boolean;
	IndexSize: number;
	ItemCount: number;
	// When the timeframe is predefined the back-end return a string
	timeframe: RawTimeframe | null | string;
	live: boolean;
	timeframeUserLabel: null;
	name?: string | null;
	notes?: string | null;
	MinZoomWindow?: number;
	StoreSize: number; // integer
	TimeZoomDisabled: boolean;
	Tags: Array<string>;

	States: Array<string>;
}

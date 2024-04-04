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

import { NumericID } from '~/value-objects/id';
import { RawTimeframe } from '../timeframe/raw-timeframe';

export interface UpdatableSearchDetails {
	groupID?: NumericID | null;
	userQuery?: string | undefined;
	effectiveQuery?: string | undefined;
	launchDate?: Date | undefined;
	id: NumericID;
	range?:
		| {
				start: Date;
				end: Date;
		  }
		| undefined;
	descending?: boolean | undefined;
	lastUpdate?: Date | undefined;
	storeSize?: number | undefined | undefined;
	indexSize?: number | undefined;
	itemCount?: number | undefined;
	timeZoomDisabled?: boolean | undefined;
	// When the timeframe is predefined the back-end return a string
	timeframe?: RawTimeframe | null | string | undefined;
	isLive?: boolean | undefined;
	timeframeUserLabel?: null | undefined;
	name?: string | null | undefined;
	notes?: string | null | undefined;

	collapsingIndex?: number | undefined;
	minZoomWindow?: number | undefined;
	tags?: Array<string> | undefined;
	preview?: boolean | undefined;
	duration?: string | undefined;
}

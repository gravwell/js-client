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

import { NumericID } from '~/value-objects';
import { RawTimeframe } from '../timeframe';

export interface UpdatableSearchDetails {
	groupID?: NumericID | null;
	userQuery: string;
	effectiveQuery: string;
	launchDate: Date;
	id: NumericID;
	range: {
		start: Date;
		end: Date;
	};
	descending: boolean;
	lastUpdate: Date;
	storeSize: number;
	indexSize: number;
	itemCount: number;
	timeZoomDisabled: boolean;
	// When the timeframe is predefined the back-end return a string
	timeframe: RawTimeframe | null | string;
	isLive: boolean;
	timeframeUserLabel: null;
	name: string | null;
	notes: string | null;

	collapsingIndex: number;
	minZoomWindow: number;
	tags: Array<string>;
	preview: boolean;
	duration: string;
}

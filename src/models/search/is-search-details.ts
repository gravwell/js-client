/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	array,
	boolean,
	dict,
	either,
	instanceOf,
	null_,
	number,
	object,
	string,
	Verifier,
} from '~/functions/utils/verifiers';
import { RawTimeframe } from '../timeframe';
import { SearchDetails } from './search-details';

export const rawTimeFrameDecoder: Verifier<RawTimeframe> = object({
	durationString: either(string, null_),
	timeframe: either(string, null_),
	timezone: either(string, null_),
	start: either(string, null_),
	end: either(string, null_),
});

/**
 * searchDetailsVerifier is useful for verifying that a value is a
 * SearchDetails. No transforms or conversions are performed.
 */
export const searchDetailsVerifier: Verifier<SearchDetails> = object({
	userID: string,
	groupID: either(string, null_),
	userQuery: string,
	id: string,
	effectiveQuery: string,
	launchDate: instanceOf(Date),
	descending: boolean,
	started: instanceOf(Date),
	lastUpdate: instanceOf(Date),
	storeSize: number,
	indexSize: number,
	itemCount: number,
	timeZoomDisabled: boolean,
	collapsingIndex: number,
	noHistory: boolean,
	minZoomWindow: number,
	preview: boolean,
	duration: string,
	tags: array(string),
	range: object({
		start: instanceOf(Date),
		end: instanceOf(Date),
	}),
	timeframe: either(dict(rawTimeFrameDecoder), null_, string),
	timeframeUserLabel: null_,
	isLive: boolean,
	name: either(string, null_),
	notes: either(string, null_),
	renderDownloadFormats: array(string),

	import: object({
		batchInfo: string,
		batchName: string,
		imported: boolean,
		time: instanceOf(Date),
	}),
});

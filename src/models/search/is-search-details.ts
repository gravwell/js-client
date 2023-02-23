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
	date,
	Decoder,
	dict,
	either,
	either3,
	hardcoded,
	null_,
	number,
	object,
	string,
} from 'decoders';
import { mkTypeGuard } from '../../functions/utils/type-guards';
import { RawTimeframe } from '../timeframe';
import { SearchDetails } from './search-details';

export const rawTimeFrameDecoder: Decoder<RawTimeframe> = object({
	durationString: either(string, null_),
	timeframe: either(string, null_),
	timezone: either(string, null_),
	start: either(string, null_),
	end: either(string, null_),
});

const searchDetailsDecoder: Decoder<SearchDetails> = object({
	userID: string,
	groupID: either(string, null_),
	userQuery: string,
	id: string,
	effectiveQuery: string,
	launchDate: date,
	descending: boolean,
	started: date,
	lastUpdate: date,
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
	states: array(string),
	range: object({
		start: date,
		end: date,
	}),
	timeframe: either3<RawTimeframe, null, string>(dict(rawTimeFrameDecoder), null_, string),
	timeframeUserLabel: null_,
	isLive: boolean,
	name: either(string, null_),
	notes: either(string, null_),
	renderDownloadFormats: hardcoded(['json', 'text', 'csv', 'archive']),

	import: object({
		batchInfo: string,
		batchName: string,
		imported: boolean,
		time: date,
	}),
});

export const isSearchDetails: (v: unknown) => v is SearchDetails = mkTypeGuard(searchDetailsDecoder);

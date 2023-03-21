/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearchDetails } from './raw-search-details';
import { SearchDetails } from './search-details';

export const toSearchDetails = (rawSearchDetails: RawSearchDetails): SearchDetails => ({
	userID: rawSearchDetails.UID.toString(),
	groupID: rawSearchDetails?.GID?.toString() ?? null,
	userQuery: rawSearchDetails.UserQuery,
	effectiveQuery: rawSearchDetails.EffectiveQuery,
	launchDate: new Date(rawSearchDetails.LastUpdate),
	id: rawSearchDetails.ID,
	range: {
		start: new Date(rawSearchDetails.StartRange),
		end: new Date(rawSearchDetails.EndRange),
	},
	descending: rawSearchDetails.Descending,
	started: new Date(rawSearchDetails.Started),
	lastUpdate: new Date(rawSearchDetails.LastUpdate),
	storeSize: rawSearchDetails.StoreSize,
	indexSize: rawSearchDetails.IndexSize,
	itemCount: rawSearchDetails.ItemCount,
	timeZoomDisabled: rawSearchDetails.TimeZoomDisabled,
	name: rawSearchDetails.Metadata?.name ?? null,
	notes: rawSearchDetails.Metadata?.notes ?? null,
	renderDownloadFormats: rawSearchDetails.RenderDownloadFormats,
	timeframe: rawSearchDetails.Metadata?.timeframe ?? null,
	isLive: rawSearchDetails.Metadata?.live ?? false,
	timeframeUserLabel: rawSearchDetails?.Metadata?.timeframeUserLabel ?? null,
	collapsingIndex: rawSearchDetails.CollapsingIndex,
	import: {
		batchInfo: rawSearchDetails.Import.BatchInfo,
		batchName: rawSearchDetails.Import.BatchName,
		imported: rawSearchDetails.Import.Imported,
		time: new Date(rawSearchDetails.Import.Time),
	},
	noHistory: rawSearchDetails.NoHistory,
	minZoomWindow: rawSearchDetails.MinZoomWindow ?? 1,
	tags: rawSearchDetails.Tags,
	preview: rawSearchDetails.Preview,
	duration: rawSearchDetails.Duration,
});

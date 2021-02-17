/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DataExplorerElement, DataExplorerEntry } from './data-explorer-entry';
import { RawDataExplorerElement, RawDataExplorerEntry } from './raw-data-explorer-entry';

export const toDataExplorerEntry = (raw: RawDataExplorerEntry): DataExplorerEntry => ({
	tag: raw.Tag,
	module: raw.Module,
	elements: (raw.Elements ?? []).map(toDataExplorerElement),
});

export const toDataExplorerElement = (raw: RawDataExplorerElement): DataExplorerElement => ({
	name: raw.Name,
	path: raw.Path,

	value: raw.Value,
	filters: raw.Filters ?? [],

	children: (raw.SubElements ?? []).map(toDataExplorerElement),
});

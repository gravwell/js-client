/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { AutoExtractor } from './auto-extractor';
import { RawAutoExtractor } from './raw-auto-extractor';

export const toAutoExtractor = (raw: RawAutoExtractor): AutoExtractor => ({
	_tag: DATA_TYPE.AUTO_EXTRACTOR,

	id: raw.UUID,

	userID: raw.UID.toString(),
	groupIDs: raw.GIDs?.map(id => id.toString()) ?? [],

	name: raw.Name,
	description: raw.Desc,
	labels: raw.Labels ?? [],

	isGlobal: raw.Global,
	lastUpdateDate: new Date(raw.LastUpdated),

	tag: raw.Tag,
	module: raw.Module,
	parameters: raw.Params,
	arguments: raw.Args ?? null,
});

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

import { isNull, isUndefined } from 'lodash';
import { toRawNumericID } from '../../value-objects/id';
import { RawUpdatableSearchDetails } from './raw-updatable-search-details';
import { SearchDetails } from './search-details';
import { UpdatableSearchDetails } from './updatable-search-details';

export const toRawUpdatableSearchDetails = (
	updatable: UpdatableSearchDetails,
	current: SearchDetails,
): RawUpdatableSearchDetails => ({
	GID: isUndefined(updatable.groupID)
		? Number(current.groupID)
		: isNull(updatable.groupID)
		? null
		: toRawNumericID(updatable.groupID),

	UserQuery: updatable.userQuery ?? current.userQuery,
	EffectiveQuery: updatable.effectiveQuery ?? current.effectiveQuery,

	Preview: updatable.preview ?? current.preview,
	StartRange: updatable.range?.start ?? current.range.start,
	EndRange: updatable.range?.end ?? current.range.end,

	LastUpdate: updatable.range?.end ?? current.range.end,
	Duration: updatable.range?.end ?? current.range.end,

	Descending: updatable.descending ?? current.descending,
	IndexSize: updatable.indexSize ?? current.indexSize,
	ItemCount: updatable.itemCount ?? current.itemCount,
	timeframe: updatable.timeframe ?? current.timeframe,
	live: updatable.isLive ?? current.isLive,
	timeframeUserLabel: updatable.timeframeUserLabel ?? current.timeframeUserLabel,
	name: updatable.name ?? current.name,
	notes: updatable.notes ?? current.notes,
	MinZoomWindow: updatable.minZoomWindow ?? current.minZoomWindow,
	StoreSize: updatable.storeSize ?? current.storeSize,
	TimeZoomDisabled: updatable.timeZoomDisabled ?? current.timeZoomDisabled,
	Tags: updatable.tags ?? current.tags,
});

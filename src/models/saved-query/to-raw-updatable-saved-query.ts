/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull, isUndefined } from 'lodash';
import { toRawNumericID } from '~/value-objects';
import { toRawTimeframe } from '../timeframe';
import { RawUpdatableSavedQuery } from './raw-updatable-saved-query';
import { SavedQuery } from './saved-query';
import { UpdatableSavedQuery } from './updatable-saved-query';

export const toRawUpdatableSavedQuery = (
	updatable: UpdatableSavedQuery,
	current: SavedQuery,
): RawUpdatableSavedQuery => {
	const defaultTimeframe = isUndefined(updatable.defaultTimeframe)
		? current.defaultTimeframe
		: updatable.defaultTimeframe;
	const rawTimeframe = isNull(defaultTimeframe) ? null : toRawTimeframe(defaultTimeframe);

	return {
		ThingUUID: current.id,
		UID: toRawNumericID(current.userID),
		GUID: updatable.globalID ?? current.globalID,

		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),
		Global: updatable.isGlobal ?? current.isGlobal,

		Name: updatable.name ?? current.name,
		Description: (isUndefined(updatable.description) ? current.description : updatable.description) ?? '',
		Labels: updatable.labels ?? current.labels,

		Query: updatable.query ?? current.query,
		Metadata: { timeframe: rawTimeframe },
	};
};

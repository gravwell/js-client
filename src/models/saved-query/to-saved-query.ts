/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull } from 'lodash';
import { DATA_TYPE } from '~/models/data-type';
import { toNumericID } from '~/value-objects/id';
import { toTimeframe } from '../timeframe/to-timeframe';
import { RawSavedQuery } from './raw-saved-query';
import { SavedQuery } from './saved-query';

export const toSavedQuery = (raw: RawSavedQuery): SavedQuery => {
	const rawTimeframe = raw.Metadata?.timeframe ?? null;
	const defaultTimeframe = isNull(rawTimeframe) ? null : toTimeframe(rawTimeframe);

	return {
		_tag: DATA_TYPE.SAVED_QUERY,
		id: raw.ThingUUID,
		globalID: raw.GUID,

		userID: toNumericID(raw.UID),

		can: {
			delete: raw.Can.Delete,
			modify: raw.Can.Modify,
			share: raw.Can.Share,
		},

		groupIDs: (raw.GIDs ?? []).map(toNumericID),
		isGlobal: raw.Global,

		WriteAccess: {
			GIDs: raw.WriteAccess.GIDs.map(toNumericID),
			Global: raw.WriteAccess.Global,
		},

		name: raw.Name,
		description: raw.Description.trim() === '' ? null : raw.Description,
		labels: raw.Labels ?? [],

		query: raw.Query,
		defaultTimeframe,
	};
};

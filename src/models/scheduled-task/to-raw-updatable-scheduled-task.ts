/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil, isUndefined } from 'lodash';
import { omitUndefinedShallow } from '~/functions/utils/omit-undefined-shallow';
import { durationToSeconds } from '~/models/scheduled-task/to-raw-creatable-scheduled-task';
import { toRawNumericID } from '~/value-objects/id';
import { RawUpdatableScheduledTask } from './raw-updatable-scheduled-task';
import { ScheduledQuery } from './scheduled-query';
import { ScheduledScript } from './scheduled-script';
import { ScheduledTask } from './scheduled-task';
import {
	TaggedUpdatableScheduledQuery,
	TaggedUpdatableScheduledScript,
	UpdatableScheduledTask,
} from './updatable-scheduled-task';

const NIL_SEARCH_REF = '00000000-0000-0000-0000-000000000000';

export const toRawUpdatableScheduledTask = (
	updatable: UpdatableScheduledTask,
	current: ScheduledTask,
): RawUpdatableScheduledTask => {
	const base = {
		Name: updatable.name ?? current.name,
		Description: updatable.description ?? current.description,
		Labels: updatable.labels ?? current.labels,

		OneShot: updatable.oneShot ?? current.oneShot,
		Disabled: updatable.isDisabled ?? current.isDisabled,

		Timezone: (isUndefined(updatable.timezone) ? current.timezone : updatable.timezone) ?? '',
		Schedule: updatable.schedule ?? current.schedule,
	};

	const type = updatable.type ?? current.type;
	switch (type) {
		case 'query': {
			const _updatable = updatable as TaggedUpdatableScheduledQuery;
			const _current = current as ScheduledQuery;

			// If search ref is set, don't send search string.
			const nextSearchString =
				!isNil(_updatable.searchReference) && _updatable.searchReference !== NIL_SEARCH_REF
					? undefined
					: _updatable.query ?? _current.query;

			return omitUndefinedShallow({
				...base,
				SearchString: nextSearchString,
				Duration: -Math.abs(_updatable.searchSince?.secondsAgo ?? _current.searchSince.secondsAgo),
				SearchSinceLastRun: _updatable.searchSince?.lastRun ?? _current.searchSince.lastRun,

				Script: '',
				DebugMode: false,

				TimeframeOffset: Math.abs(durationToSeconds(_updatable.timeframeOffset ?? _current.timeframeOffset)) * -1,
				BackfillEnabled: _updatable.backfillEnabled ?? _current.backfillEnabled,
				SearchReference: _updatable.searchReference,
				Global: _updatable.isGlobal ?? _current.isGlobal,
				Groups: (_updatable.groupIDs ?? _current.groupIDs).map(toRawNumericID),
				WriteAccess: {
					Global: _updatable.WriteAccess?.Global ?? _current.WriteAccess.Global,
					GIDs: (_updatable.WriteAccess?.GIDs ?? _current.WriteAccess.GIDs).map(toRawNumericID),
				},
			});
		}
		case 'script': {
			const _updatable = updatable as TaggedUpdatableScheduledScript;
			const _current = current as ScheduledScript;

			return {
				...base,
				Groups: (_updatable.groupIDs ?? _current.groupIDs).map(toRawNumericID),
				Global: _updatable.isGlobal ?? _current.isGlobal,

				SearchString: '',
				Duration: 0,
				SearchSinceLastRun: false,
				Script: _updatable.script ?? _current.script,
				DebugMode: _updatable.isDebugging ?? _current.isDebugging,
				WriteAccess: {
					Global: false,
					GIDs: [],
				},
			};
		}
	}
};

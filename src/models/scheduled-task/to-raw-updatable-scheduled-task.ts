/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { toRawNumericID } from '~/value-objects';
import { RawUpdatableScheduledTask } from './raw-updatable-scheduled-task';
import { ScheduledQuery } from './scheduled-query';
import { ScheduledScript } from './scheduled-script';
import { ScheduledTask } from './scheduled-task';
import {
	TaggedUpdatableScheduledQuery,
	TaggedUpdatableScheduledScript,
	UpdatableScheduledTask,
} from './updatable-scheduled-task';

export const toRawUpdatableScheduledTask = (
	updatable: UpdatableScheduledTask,
	current: ScheduledTask,
): RawUpdatableScheduledTask => {
	const base = {
		Groups: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),
		Global: updatable.isGlobal ?? current.isGlobal,

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
			const _updatable = <TaggedUpdatableScheduledQuery>updatable;
			const _current = <ScheduledQuery>current;

			return {
				...base,
				SearchString: _updatable.query ?? _current.query,
				Duration: -Math.abs(_updatable.searchSince?.secondsAgo ?? _current.searchSince.secondsAgo),
				SearchSinceLastRun: _updatable.searchSince?.lastRun ?? _current.searchSince.lastRun,

				Script: '',
				DebugMode: false,
			};
		}
		case 'script': {
			const _updatable = <TaggedUpdatableScheduledScript>updatable;
			const _current = <ScheduledScript>current;

			return {
				...base,
				SearchString: '',
				Duration: 0,
				SearchSinceLastRun: false,

				Script: _updatable.script ?? _current.script,
				DebugMode: _updatable.isDebugging ?? _current.isDebugging,
			};
		}
	}
};

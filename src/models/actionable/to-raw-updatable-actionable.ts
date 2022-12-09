/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isUndefined } from 'lodash';
import { toRawNumericID } from '~/value-objects';
import { Actionable, ActionableAction } from './actionable';
import { RawUpdatableActionable } from './raw-updatable-actionable';
import { toRawActionableAction, toRawActionableTrigger } from './to-raw-actionable';
import { UpdatableActionable } from './updatable-actionable';

export const toRawUpdatableActionable = (
	updatable: UpdatableActionable,
	current: Actionable,
): RawUpdatableActionable => ({
	UID: toRawNumericID(updatable.userID ?? current.userID),
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

	Global: updatable.isGlobal ?? current.isGlobal,
	Labels: updatable.labels ?? current.labels,

	Name: updatable.name ?? current.name,
	Description: isUndefined(updatable.description) ? current.description : updatable.description,
	Contents: {
		menuLabel: isUndefined(updatable.menuLabel) ? current.menuLabel : updatable.menuLabel,
		actions: (updatable.actions ?? current.actions)
			.map<ActionableAction>(action => ({
				...action,
				description: action.description ?? null,
				placeholder: action.placeholder ?? null,
				noValueUrlEncode: action.noValueUrlEncode ?? false,
				start: action.start ?? { type: 'stringFormat', placeholder: null, format: null },
				end: action.end ?? { type: 'stringFormat', placeholder: null, format: null },
			}))
			.map(toRawActionableAction),
		triggers: (updatable.triggers ?? current.triggers).map(toRawActionableTrigger),
	},
});

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omitUndefinedShallow } from '~/functions/utils/omit-undefined-shallow';
import { toRawNumericID } from '~/value-objects/id';
import { toRawActionableAction, toRawActionableTrigger } from '../actionable/to-raw-actionable';
import { ActionableAction } from './actionable';
import { CreatableActionable } from './creatable-actionable';
import { RawCreatableActionable } from './raw-creatable-actionable';

export const toRawCreatableActionable = (creatable: CreatableActionable): RawCreatableActionable =>
	omitUndefinedShallow({
		UID: creatable.userID ? toRawNumericID(creatable.userID) : undefined,
		GIDs: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],

		Global: creatable.isGlobal ?? false,
		Labels: creatable.labels ?? [],

		Name: creatable.name,
		Description: creatable.description ?? null,
		Contents: {
			menuLabel: creatable.menuLabel ?? null,
			actions: creatable.actions
				.map<ActionableAction>(action => ({
					...action,
					description: action.description ?? null,
					placeholder: action.placeholder ?? null,
					noValueUrlEncode: action.noValueUrlEncode ?? false,
					start: action.start ?? { type: 'stringFormat', placeholder: null, format: null },
					end: action.end ?? { type: 'stringFormat', placeholder: null, format: null },
				}))
				.map(toRawActionableAction),
			triggers: creatable.triggers.map(toRawActionableTrigger),
		},

		Disabled: creatable.isDisabled,
	});

import { omitUndefinedShallow } from '../../functions/utils';
import { toRawNumericID } from '../../value-objects';
import { ActionableAction, toRawActionableAction } from '../actionable';
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
					start: action.start ?? { type: 'stringFormat', placeholder: null, format: null },
					end: action.end ?? { type: 'stringFormat', placeholder: null, format: null },
				}))
				.map(toRawActionableAction),
			triggers: creatable.triggers.map(toRawActionableTrigger),
		},
	});

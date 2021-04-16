/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { toRawRegex } from '~/value-objects';
import { ActionableAction, ActionableTimeVariable, ActionableTrigger } from './actionable';
import { ActionableCommand } from './actionable-command';
import { RawActionableAction, RawActionableTimeVariable, RawActionableTrigger } from './raw-actionable';
import { RawActionableCommand } from './raw-actionable-command';

export const toRawActionableTrigger = (trigger: ActionableTrigger): RawActionableTrigger => ({
	pattern: toRawRegex(trigger.pattern),
	hyperlink: trigger.activatesOn === 'clicks and selection',
});

export const toRawActionableAction = (action: ActionableAction): RawActionableAction => ({
	name: action.name,
	description: action.description,
	placeholder: action.placeholder,
	command: toRawActionableCommand(action.command),
	start: toRawActionableTimeVariable(action.start),
	end: toRawActionableTimeVariable(action.end),
});

export const toRawActionableCommand = (cmd: ActionableCommand): RawActionableCommand => {
	switch (cmd.type) {
		case 'query':
			return { type: 'query', reference: cmd.userQuery };
		case 'template':
			return { type: 'template', reference: cmd.templateUUID };
		case 'savedQuery':
			return { type: 'savedQuery', reference: cmd.queryUUID };
		case 'dashboard':
			return {
				type: 'dashboard',
				reference: cmd.dashboardUUID,
				options: omitUndefinedShallow({ variable: cmd.dashboardVariable ?? undefined }),
			};
		case 'url':
			return {
				type: 'url',
				reference: cmd.urlTemplate,
				options: omitUndefinedShallow({
					modal: cmd.modal,
					modalWidth: cmd.modalWidthPercentage?.toString() ?? undefined,
				}),
			};
	}
};

export const toRawActionableTimeVariable = (timeVar: ActionableTimeVariable): RawActionableTimeVariable => {
	switch (timeVar.type) {
		case 'timestamp':
			return { type: 'timestamp', placeholder: timeVar.placeholder, format: null };
		case 'stringFormat':
			return { type: 'string', placeholder: timeVar.placeholder, format: timeVar.format };
	}
};

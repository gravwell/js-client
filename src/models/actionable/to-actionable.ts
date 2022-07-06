/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { DATA_TYPE } from '~/models';
import { toRegex } from '~/value-objects';
import { Actionable, ActionableAction, ActionableTimeVariable, ActionableTrigger } from './actionable';
import { ActionableCommand } from './actionable-command';
import { RawActionable, RawActionableAction, RawActionableTimeVariable, RawActionableTrigger } from './raw-actionable';
import { RawActionableCommand } from './raw-actionable-command';

export const toActionable = (raw: RawActionable): Actionable => ({
	_tag: DATA_TYPE.ACTIONABLE,
	globalID: raw.GUID,
	id: raw.ThingUUID,

	userID: raw.UID.toString(),
	groupIDs: raw.GIDs?.map(id => id.toString()) ?? [],

	name: raw.Name,
	description: raw.Description.trim() === '' ? null : raw.Description,
	menuLabel: raw.Contents.menuLabel,
	labels: raw.Labels ?? [],

	isGlobal: raw.Global,
	isDisabled: raw.Disabled,

	lastUpdateDate: new Date(raw.Updated),

	triggers: raw.Contents.triggers?.map(toActionableTrigger) ?? [],
	actions: raw.Contents.actions?.map(toActionableAction) ?? [],
});

export const toActionableTrigger = (raw: RawActionableTrigger): ActionableTrigger => ({
	// All actionable triggers use the global flag
	pattern: isString(raw) ? toRegex(raw, ['g']) : toRegex(raw.pattern, ['g']),
	activatesOn: isString(raw) ? 'clicks and selection' : raw.hyperlink ? 'clicks and selection' : 'selection',
});

export const toActionableAction = (raw: RawActionableAction): ActionableAction => ({
	name: raw.name,
	description: raw.description,
	placeholder: raw.placeholder,
	command: toActionableCommand(raw.command),
	noValueUrlEncode: raw.noValueUrlEncode,
	start: raw.start ? toActionableTimeVariable(raw.start) : { type: 'stringFormat', placeholder: null, format: null },
	end: raw.end ? toActionableTimeVariable(raw.end) : { type: 'stringFormat', placeholder: null, format: null },
});

export const toActionableCommand = (raw: RawActionableCommand): ActionableCommand => {
	switch (raw.type) {
		case 'query':
			return { type: 'query', userQuery: raw.reference };
		case 'template':
			return { type: 'template', templateID: raw.reference, templateVariable: raw.options?.variable ?? null };
		case 'savedQuery':
			return { type: 'savedQuery', queryID: raw.reference };
		case 'dashboard':
			return { type: 'dashboard', dashboardID: raw.reference, dashboardVariable: raw.options?.variable ?? null };
		case 'url': {
			const modalWidth = raw.options?.modalWidth;
			return {
				type: 'url',
				urlTemplate: raw.reference,
				modal: raw.options?.modal ?? false,
				modalWidthPercentage: isString(modalWidth) ? parseInt(modalWidth, 10) : null,
				noValueUrlEncode: raw.options?.noValueUrlEncode ?? false,
			};
		}
	}
};

export const toActionableTimeVariable = (raw: RawActionableTimeVariable): ActionableTimeVariable => {
	switch (raw.type) {
		case 'timestamp':
			return { type: 'timestamp', placeholder: raw.placeholder };
		case 'string':
			return { type: 'stringFormat', placeholder: raw.placeholder, format: raw.format };
	}
};

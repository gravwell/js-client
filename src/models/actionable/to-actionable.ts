/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { toRegex } from '~/value-objects';
import {
	Actionable,
	ActionableAction,
	ActionableCommand,
	ActionableTimeVariable,
	ActionableTrigger,
} from './actionable';
import {
	RawActionable,
	RawActionableAction,
	RawActionableCommand,
	RawActionableTimeVariable,
	RawActionableTrigger,
} from './raw-actionable';

export const toActionable = (raw: RawActionable): Actionable => ({
	uuid: raw.GUID,
	thingUUID: raw.ThingUUID,

	userID: raw.UID.toString(),
	groupIDs: raw.GIDs?.map(id => id.toString()) ?? [],

	name: raw.Name,
	description: raw.Description.trim() === '' ? null : raw.Description,
	menuLabel: raw.Contents.menuLabel,
	labels: raw.Labels ?? [],

	isGlobal: raw.Global,
	isDisabled: raw.Disabled,

	lastUpdateDate: new Date(raw.Updated),

	triggers: raw.Contents.triggers.map(toActionableTrigger),
	actions: raw.Contents.actions.map(toActionableAction),
});

export const toActionableTrigger = (raw: RawActionableTrigger): ActionableTrigger => ({
	pattern: toRegex(raw.pattern),
	activatesOn: raw.hyperlink ? 'clicks and selection' : 'selection',
});

export const toActionableAction = (raw: RawActionableAction): ActionableAction => ({
	name: raw.name,
	description: raw.description,
	placeholder: raw.placeholder,
	command: toActionableCommand(raw.command),
	start: raw.start ? toActionableTimeVariable(raw.start) : { type: 'stringFormat', placeholder: null, format: null },
	end: raw.end ? toActionableTimeVariable(raw.end) : { type: 'stringFormat', placeholder: null, format: null },
});

export const toActionableCommand = (raw: RawActionableCommand): ActionableCommand => {
	switch (raw.type) {
		case 'query':
			return { type: 'query', userQuery: raw.reference };
		case 'template':
			return { type: 'template', templateUUID: raw.reference };
		case 'savedQuery':
			return { type: 'savedQuery', queryUUID: raw.reference };
		case 'dashboard':
			return { type: 'dashboard', dashboardUUID: raw.reference, dashboardVariable: raw.options?.variable ?? null };
		case 'url':
			const modalWidth = raw.options?.modalWidth;
			return {
				type: 'url',
				urlTemplate: raw.reference,
				modal: raw.options?.modal ?? false,
				modalWidthPercentage: isString(modalWidth) ? parseInt(modalWidth, 10) : null,
			};
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

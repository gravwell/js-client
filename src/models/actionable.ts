/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isInteger, isNull, isString } from 'lodash';
import { omitUndefinedShallow } from '../functions/utils/omit-undefined-shallow';
import {
	isNumericID,
	isRegex,
	isUUID,
	NumericID,
	RawNumericID,
	RawUUID,
	toRawRegex,
	toRegex,
	UUID,
} from '../value-objects';

export interface RawActionable {
	GUID: RawUUID;
	ThingUUID: RawUUID;
	UID: RawNumericID;
	GIDs: null | Array<RawNumericID>;
	Global: boolean;
	Name: string;
	Description: string; // Empty string is null
	Updated: string; // Timestamp
	Contents: {
		menuLabel: null | string;
		actions: Array<RawActionableAction>;
		triggers: Array<RawActionableTrigger>;
	};
	Labels: null | Array<string>;
	Disabled: boolean;
}

export interface Actionable {
	uuid: UUID;
	thingUUID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	name: string;
	description: string | null;
	menuLabel: null | string;
	labels: Array<string>;

	isGlobal: boolean;
	isDisabled: boolean;

	lastUpdateDate: Date;

	triggers: Array<ActionableTrigger>;
	actions: Array<ActionableAction>;
}

export interface RawActionableTrigger {
	pattern: string;
	hyperlink: boolean;
}

export interface ActionableTrigger {
	pattern: RegExp;
	activatesOn: 'selection' | 'clicks and selection';
}

export interface RawActionableAction {
	name: string;
	description: string | null;
	placeholder: string | null;
	start?: RawActionableTimeVariable;
	end?: RawActionableTimeVariable;
	command: RawActionableCommand;
}

export interface ActionableAction {
	name: string;
	description: string | null;
	placeholder: string | null;
	start: ActionableTimeVariable;
	end: ActionableTimeVariable;
	command: ActionableCommand;
}

export type RawActionableTimeVariable =
	| { type: 'timestamp'; format: null | string; placeholder: null | string }
	| { type: 'string'; format: null | string; placeholder: null | string };

export type ActionableTimeVariable =
	| { type: 'timestamp'; placeholder: null | string }
	| { type: 'stringFormat'; format: null | string; placeholder: null | string };

export type RawActionableCommand =
	| { type: 'query'; reference: string; options?: {} }
	| { type: 'template'; reference: RawUUID; options?: {} }
	| { type: 'savedQuery'; reference: RawUUID; options?: {} }
	| { type: 'dashboard'; reference: RawUUID; options?: { variable?: string } }
	| { type: 'url'; reference: string; options: { modal?: boolean; modalWidth?: string } };

export type ActionableCommand =
	| { type: 'query'; userQuery: string }
	| { type: 'template'; templateUUID: UUID }
	| { type: 'savedQuery'; queryUUID: UUID }
	| { type: 'dashboard'; dashboardUUID: UUID; dashboardVariable: string | null }
	| { type: 'url'; urlTemplate: string; modal: boolean; modalWidthPercentage: number | null };

export const isActionable = (value: any): value is Actionable => {
	try {
		const a = <Actionable>value;
		return (
			isUUID(a.uuid) &&
			isUUID(a.thingUUID) &&
			isNumericID(a.userID) &&
			a.groupIDs.every(isNumericID) &&
			isString(a.name) &&
			(isString(a.description) || isNull(a.description)) &&
			(isString(a.menuLabel) || isNull(a.menuLabel)) &&
			a.labels.every(isString) &&
			isBoolean(a.isGlobal) &&
			isBoolean(a.isDisabled) &&
			isDate(a.lastUpdateDate) &&
			a.triggers.every(isActionableTrigger) &&
			a.actions.every(isActionableAction)
		);
	} catch {
		return false;
	}
};

export const isActionableTrigger = (value: any): value is ActionableTrigger => {
	try {
		const t = <ActionableTrigger>value;
		return isRegex(t.pattern) && ['selection', 'clicks and selection'].includes(t.activatesOn);
	} catch {
		return false;
	}
};

export const isActionableAction = (value: any): value is ActionableAction => {
	try {
		const a = <ActionableAction>value;
		return (
			isString(a.name) &&
			(isString(a.description) || isNull(a.description)) &&
			(isString(a.placeholder) || isNull(a.placeholder)) &&
			isActionableTimeVariable(a.start) &&
			isActionableTimeVariable(a.end) &&
			isActionableCommand(a.command)
		);
	} catch {
		return false;
	}
};

export const isActionableTimeVariable = (value: any): value is ActionableTimeVariable => {
	try {
		const t = <ActionableTimeVariable>value;
		switch (t.type) {
			case 'timestamp':
				return isString(t.placeholder) || isNull(t.placeholder);
			case 'stringFormat':
				return (isString(t.placeholder) || isNull(t.placeholder)) && (isString(t.format) || isNull(t.format));
			default:
				throw Error();
		}
	} catch {
		return false;
	}
};

export const isActionableCommand = (value: any): value is ActionableCommand => {
	try {
		const cmd = <ActionableCommand>value;
		switch (cmd.type) {
			case 'query':
				return isString(cmd.userQuery);
			case 'template':
				return isUUID(cmd.templateUUID);
			case 'savedQuery':
				return isUUID(cmd.queryUUID);
			case 'dashboard':
				return isUUID(cmd.dashboardUUID) && (isString(cmd.dashboardVariable) || isNull(cmd.dashboardVariable));
			case 'url':
				return (
					isString(cmd.urlTemplate) &&
					isBoolean(cmd.modal) &&
					(isInteger(cmd.modalWidthPercentage) || isNull(cmd.modalWidthPercentage))
				);
			default:
				throw Error();
		}
	} catch {
		return false;
	}
};

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
			return {
				type: 'url',
				urlTemplate: raw.reference,
				modal: raw.options?.modal ?? false,
				modalWidthPercentage: isString(raw.options?.modalWidth) ? parseInt(raw.options.modalWidth, 10) : null,
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

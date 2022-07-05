/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isInteger, isNull, isString } from 'lodash';
import { DATA_TYPE } from '~/models';
import { isRegex, isUUID } from '~/value-objects';
import { Actionable, ActionableAction, ActionableTimeVariable, ActionableTrigger } from './actionable';
import { ActionableCommand } from './actionable-command';
import { isActionableData } from './is-actionable-data';

export const isActionable = (value: unknown): value is Actionable => {
	try {
		const a = <Actionable>value;
		return a._tag === DATA_TYPE.ACTIONABLE && isActionableData(a);
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
				return isUUID(cmd.templateID);
			case 'savedQuery':
				return isUUID(cmd.queryID);
			case 'dashboard':
				return isUUID(cmd.dashboardID) && (isString(cmd.dashboardVariable) || isNull(cmd.dashboardVariable));
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

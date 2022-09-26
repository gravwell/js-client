/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models/data-type';
import { ActionableCommand } from './actionable-command';
import { ActionableData } from './actionable-data';

export interface Actionable extends ActionableData {
	_tag: DATA_TYPE.ACTIONABLE;
}

export interface ActionableTrigger {
	pattern: RegExp;
	activatesOn: 'selection' | 'clicks and selection';
}

export interface ActionableAction {
	name: string;
	description: string | null;
	placeholder: string | null;
	noValueUrlEncode?: boolean; // Applicable to URL opening action. False by default. True means url won't be encoded when opening a URL
	start: ActionableTimeVariable;
	end: ActionableTimeVariable;
	command: ActionableCommand;
}

export type ActionableTimeVariable =
	| { type: 'timestamp'; placeholder: null | string }
	| { type: 'stringFormat'; format: null | string; placeholder: null | string };

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { ActionableCommand } from './actionable-command';

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

export interface ActionableTrigger {
	pattern: RegExp;
	activatesOn: 'selection' | 'clicks and selection';
}

export interface ActionableAction {
	name: string;
	description: string | null;
	placeholder: string | null;
	start: ActionableTimeVariable;
	end: ActionableTimeVariable;
	command: ActionableCommand;
}

export type ActionableTimeVariable =
	| { type: 'timestamp'; placeholder: null | string }
	| { type: 'stringFormat'; format: null | string; placeholder: null | string };

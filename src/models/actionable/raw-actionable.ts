/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';
import { RawActionableCommand } from './raw-actionable-command';

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

export interface RawActionableAction {
	name: string;
	description: string | null;
	placeholder: string | null;
	start?: RawActionableTimeVariable;
	end?: RawActionableTimeVariable;
	command: RawActionableCommand;
}

export interface RawActionableTrigger {
	pattern: string;
	hyperlink: boolean;
}

export type RawActionableTimeVariable =
	| { type: 'timestamp'; format: null | string; placeholder: null | string }
	| { type: 'string'; format: null | string; placeholder: null | string };

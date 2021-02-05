/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';

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

export type RawActionableCommand =
	| { type: 'query'; reference: string; options?: {} }
	| { type: 'template'; reference: RawUUID; options?: {} }
	| { type: 'savedQuery'; reference: RawUUID; options?: {} }
	| { type: 'dashboard'; reference: RawUUID; options?: { variable?: string } }
	| { type: 'url'; reference: string; options: { modal?: boolean; modalWidth?: string } };

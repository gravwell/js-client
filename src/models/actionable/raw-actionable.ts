/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
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
		actions?: Array<RawActionableAction> | null;
		triggers?: Array<RawActionableTrigger> | null;
	};
	Labels: null | Array<string>;
	Disabled: boolean;
}

export interface RawActionableAction {
	name: string;
	description: string | null;
	placeholder: string | null;
	noValueUrlEncode?: boolean; // Applicable to URL opening action. False by default. True means url won't be encoded when opening a URL
	start?: RawActionableTimeVariable;
	end?: RawActionableTimeVariable;
	command: RawActionableCommand;
}

/**
 * An Actionable trigger can be a single string or the object below.
 */
export type RawActionableTrigger =
	| {
			pattern: string;
			hyperlink: boolean;
	  }
	| string;

export type RawActionableTimeVariable =
	| { type: 'timestamp'; format: null | string; placeholder: null | string }
	| { type: 'string'; format: null | string; placeholder: null | string };

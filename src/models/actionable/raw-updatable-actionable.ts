/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects';
import { RawActionableAction, RawActionableTrigger } from './raw-actionable';

export interface RawUpdatableActionable {
	// ?Question: why do we allow that field to be set?
	GUID?: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;

	Name: string;
	Description: string | null; // Null becomes empty string
	Contents: {
		menuLabel: string | null;
		actions: Array<RawActionableAction>;
		triggers: Array<RawActionableTrigger>;
	};

	Disabled: boolean;
}

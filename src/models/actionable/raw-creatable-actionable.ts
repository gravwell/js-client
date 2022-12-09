/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects';
import { RawActionableAction, RawActionableTrigger } from './raw-actionable';

export interface RawCreatableActionable {
	// ?Question: Why do we allow that field to be set? gravwell/gravwell#2318 nº 3
	GUID?: RawUUID;

	// !WARNING: That's not working right now, but there's an open issue for that gravwell/gravwell#2318 nº 5
	UID?: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;

	Name: string;
	Description: string | null;
	Contents: {
		menuLabel: string | null;
		actions: Array<RawActionableAction>;
		triggers: Array<RawActionableTrigger>;
	};
}

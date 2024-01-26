/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '~/value-objects/id';
import { BroadcastedLevel } from './broadcasted-notification';

export interface RawUpdatableNotification {
	IgnoreUntil: string; // Timestamp eg. '0001-01-01T00:00:00Z'
	UID: RawNumericID;
	GID: RawNumericID;
	Type: number;
	Broadcast: boolean;
	Sent: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	Expires: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	Msg: string;
	Level?: BroadcastedLevel;
	Link?: string | null;
}

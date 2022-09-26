/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID } from '~/value-objects';
import { BroadcastedLevel } from './broadcasted-notification';

export interface RawBroadcastedNotification {
	UID: RawNumericID;
	Sender: number; // 0 for undefined
	Type: number;
	Broadcast: true;
	Sent: string;
	Expires: string;
	IgnoreUntil: string;
	Msg: string;
	Origin: string;
	Level: BroadcastedLevel;
	Link: string | null;
}

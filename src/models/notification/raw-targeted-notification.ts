/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawTargetedNotification {
	UID: number; // 0 for undefined
	GID: number; // 0 for undefined
	Sender: number; // 0 for undefined
	Type: number;
	Broadcast: false;
	Sent: string;
	Expires: string;
	IgnoreUntil: string;
	Msg: string;
	Origin: string;
}

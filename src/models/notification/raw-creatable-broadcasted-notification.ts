/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface RawCreatableBroadcastedNotification {
	Type?: number;
	Broadcast: true;
	Sent?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	Expires?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	IgnoreUntil?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
	Msg: string;
}

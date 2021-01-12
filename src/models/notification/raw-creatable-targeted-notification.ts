/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export type RawCreatableTargetedNotification =
	| RawCreatableMyselfTargetedNotification
	| RawCreatableGroupTargetedNotification
	| RawCreatableUserTargetedNotification;

export interface RawCreatableMyselfTargetedNotification extends RawCreatableBaseTargetedNotification {
	UID: 0;
	GID: 0;
}

export interface RawCreatableGroupTargetedNotification extends RawCreatableBaseTargetedNotification {
	UID: 0;
	GID: number; // 0 is undefined
}

export interface RawCreatableUserTargetedNotification extends RawCreatableBaseTargetedNotification {
	UID: number; // 0 is undefined
	GID: 0;
}

export interface RawCreatableBaseTargetedNotification {
	Type?: number;
	Broadcast: false;
	Sent?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	Expires?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	IgnoreUntil?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
	Msg: string;
}

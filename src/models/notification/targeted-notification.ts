/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export type TargetedNotification = MyselfTargetedNotification | GroupTargetedNotification | UserTargetedNotification;

export interface MyselfTargetedNotification extends BaseTargetedNotification {
	targetType: 'myself';
}

export interface GroupTargetedNotification extends BaseTargetedNotification {
	targetType: 'group';

	/**
	 * ID of the group targeted by the notification
	 */
	groupID: string;
}

export interface UserTargetedNotification extends BaseTargetedNotification {
	targetType: 'user';

	/**
	 * ID of the user targeted by the notification
	 */
	userID: string;
}

export interface BaseTargetedNotification {
	id: string;
	customID?: string;
	type: 'targeted';
	message: string;

	sentDate: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	expirationDate: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	ignoreUntilDate: string; // Timestamp eg. '0001-01-01T00:00:00Z'

	origin: string;
	senderID: string;
}

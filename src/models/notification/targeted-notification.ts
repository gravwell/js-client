/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID, UUID } from '~/value-objects';

export type TargetedNotificationTargetType = TargetedNotification['targetType'];
export type TargetedNotification = MyselfTargetedNotification | GroupTargetedNotification | UserTargetedNotification;

export interface MyselfTargetedNotification extends BaseTargetedNotification {
	targetType: 'myself';
}

export interface GroupTargetedNotification extends BaseTargetedNotification {
	targetType: 'group';

	/** ID of the group targeted by the notification */
	groupID: NumericID;
}

export interface UserTargetedNotification extends BaseTargetedNotification {
	targetType: 'user';
}

export interface BaseTargetedNotification {
	id: NumericID;
	customID: NumericID | null;
	userID: NumericID;
	globalID: UUID;
	type: 'targeted';
	message: string;

	sentDate: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	expirationDate: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	ignoreUntilDate: string; // Timestamp eg. '0001-01-01T00:00:00Z'

	origin: string;
	senderID: string;
	link: string | null;
}

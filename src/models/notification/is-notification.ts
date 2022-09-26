/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '../data-type';
import { isNotificationData } from './is-notification-data';
import { Notification } from './notification';

export const isNotification = (value: unknown): value is Notification => {
	try {
		const notification = value as Notification;
		return notification._tag === DATA_TYPE.NOTIFICATION && isNotificationData(notification);
	} catch {
		return false;
	}
};

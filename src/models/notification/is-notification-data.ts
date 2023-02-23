/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBroadcastedNotification } from './is-broadcasted-notification';
import { isTargetNotification } from './is-targeted-notification';
import { NotificationData } from './notification-data';

export const isNotificationData = (value: unknown): value is NotificationData => {
	try {
		const notificationData = value as NotificationData;
		return isTargetNotification(notificationData) || isBroadcastedNotification(notificationData);
	} catch {
		return false;
	}
};

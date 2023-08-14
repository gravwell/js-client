/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { iso8601 } from 'decoders';
import { isNil, isString } from 'lodash';
import { isNumericID, isUUID } from '~/value-objects';
import {
	BaseTargetedNotification,
	GroupTargetedNotification,
	MyselfTargetedNotification,
	TargetedNotification,
	UserTargetedNotification,
} from './targeted-notification';

export const isTargetNotification = (value: unknown): value is TargetedNotification => {
	try {
		const notification = value as TargetedNotification;
		return (
			isBaseTargetedNotification(notification) &&
			(isMyselfTargetedNotification(notification) ||
				isGroupTargetedNotification(notification) ||
				isUserTargetedNotification(notification))
		);
	} catch {
		return false;
	}
};

const isBaseTargetedNotification = (value: unknown): value is BaseTargetedNotification => {
	try {
		const notification = value as BaseTargetedNotification;
		const {
			id,
			customID,
			userID,
			globalID,
			type,
			message,
			sentDate,
			expirationDate,
			ignoreUntilDate,
			origin,
			senderID,
			link,
		} = notification;

		return (
			type === 'targeted' &&
			isNumericID(id) &&
			(isNumericID(customID) || isNil(customID)) &&
			isNumericID(userID) &&
			(isUUID(globalID) || globalID === '0') &&
			isString(message) &&
			iso8601.decode(sentDate).ok &&
			iso8601.decode(expirationDate).ok &&
			iso8601.decode(ignoreUntilDate).ok &&
			isString(origin) &&
			isNumericID(senderID) &&
			(isString(link) || link === null)
		);
	} catch {
		return false;
	}
};

const isMyselfTargetedNotification = (value: unknown): value is MyselfTargetedNotification => {
	try {
		const notification = value as MyselfTargetedNotification;
		const { targetType } = notification;
		return targetType === 'myself';
	} catch {
		return false;
	}
};

const isGroupTargetedNotification = (value: unknown): value is GroupTargetedNotification => {
	try {
		const notification = value as GroupTargetedNotification;
		const { targetType, groupID } = notification;
		return targetType === 'group' && isNumericID(groupID);
	} catch {
		return false;
	}
};

const isUserTargetedNotification = (value: unknown): value is UserTargetedNotification => {
	try {
		const notification = value as UserTargetedNotification;
		const { targetType, userID } = notification;
		return targetType === 'user' && isNumericID(userID);
	} catch {
		return false;
	}
};

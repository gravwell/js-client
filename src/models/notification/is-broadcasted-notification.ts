/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull, isString, isUndefined } from 'lodash';
import { iso8601String } from '~/functions/utils/verifiers';
import { isNumericID } from '~/value-objects/id';
import { BroadcastedNotification } from './broadcasted-notification';

export const isBroadcastedNotification = (value: unknown): value is BroadcastedNotification => {
	try {
		const notification = value as BroadcastedNotification;
		const { id, customID, type, message, sentDate, expirationDate, ignoreUntilDate, origin, senderID, level, link } =
			notification;

		return (
			type === 'broadcasted' &&
			isNumericID(id) &&
			(isNumericID(customID) || isUndefined(customID)) &&
			isString(message) &&
			iso8601String.guard(sentDate) &&
			iso8601String.guard(expirationDate) &&
			iso8601String.guard(ignoreUntilDate) &&
			isString(origin) &&
			isNumericID(senderID) &&
			(level === 'info' ||
				level === 'warn' ||
				level === 'error' ||
				level === 'critical' ||
				level === 'high' ||
				isNull(level)) &&
			(isString(link) || link === null)
		);
	} catch {
		return false;
	}
};

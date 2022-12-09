/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omitUndefinedShallow } from '~/functions/utils';
import {
	BaseTargetedNotification,
	BroadcastedNotification,
	DATA_TYPE,
	Notification,
	RawBroadcastedNotification,
	RawNotification,
	RawTargetedNotification,
	TargetedNotification,
} from '~/models';
import { NumericID } from '~/value-objects';

export const toNotification = (raw: RawNotification, id: NumericID): Notification => {
	const notification = raw.Broadcast ? toBroadcastedNotification(raw, id) : toTargetedNotification(raw, id);

	return { ...notification, _tag: DATA_TYPE.NOTIFICATION };
};

export const toTargetedNotification = (raw: RawTargetedNotification, id: NumericID): TargetedNotification => {
	const base: BaseTargetedNotification = omitUndefinedShallow({
		id,
		message: raw.Msg,
		customID: raw.Type === 0 ? null : raw.Type.toString(),
		type: 'targeted',
		userID: raw.UID.toString(),
		globalID: raw.GID.toString(),

		senderID: raw.Sender.toString(),
		origin: raw.Origin,

		expirationDate: raw.Expires,
		ignoreUntilDate: raw.IgnoreUntil,
		sentDate: raw.Sent,
		link: raw.Link ?? null,
	});

	if (raw.GID > 0) {
		return { ...base, targetType: 'group', groupID: raw.GID.toString() };
	} else if (raw.UID === raw.Sender) {
		return { ...base, targetType: 'myself' };
	} else {
		return { ...base, targetType: 'user' };
	}
};

export const toBroadcastedNotification = (raw: RawBroadcastedNotification, id: NumericID): BroadcastedNotification =>
	omitUndefinedShallow({
		id,
		message: raw.Msg,
		customID: raw.Type === 0 ? undefined : raw.Type.toString(),
		type: 'broadcasted',
		userID: raw.UID.toString(),

		senderID: raw.Sender.toString(),
		origin: raw.Origin,

		expirationDate: raw.Expires,
		ignoreUntilDate: raw.IgnoreUntil,
		sentDate: raw.Sent,
		level: raw.Level ?? null,
		link: raw.Link ?? null,
	});

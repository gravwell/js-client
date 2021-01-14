/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	BaseTargetedNotification,
	BroadcastedNotification,
	Notification,
	RawBroadcastedNotification,
	RawNotification,
	RawTargetedNotification,
	TargetedNotification,
} from '../../models';
import {
	APIContext,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeGetMyNotifications = (context: APIContext) => {
	const templatePath = '/api/notifications/';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Notification>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const rawRes = await fetch(url, { ...req, method: 'GET' });
		const rawObj = await parseJSONResponse<{ [id: string]: RawNotification }>(rawRes);
		return Object.entries(rawObj).map<Notification>(([id, rawNotification]) => toNotification(rawNotification, id));
	};
};

const toNotification = (raw: RawNotification, id: string): Notification =>
	raw.Broadcast ? toBroadcastedNotification(raw, id) : toTargetedNotification(raw, id);

const toTargetedNotification = (raw: RawTargetedNotification, id: string): TargetedNotification => {
	const base: BaseTargetedNotification = omitUndefinedShallow({
		id,
		message: raw.Msg,
		customID: raw.Type === 0 ? undefined : raw.Type.toString(),
		type: 'targeted',

		senderID: raw.Sender.toString(),
		origin: raw.Origin,

		expirationDate: raw.Expires,
		ignoreUntilDate: raw.IgnoreUntil,
		sentDate: raw.Sent,
	});

	if (raw.GID > 0) {
		return { ...base, targetType: 'group', groupID: raw.GID.toString() };
	} else if (raw.UID === raw.Sender) {
		return { ...base, targetType: 'myself' };
	} else {
		return { ...base, targetType: 'user', userID: raw.UID.toString() };
	}
};

const toBroadcastedNotification = (raw: RawBroadcastedNotification, id: string): BroadcastedNotification =>
	omitUndefinedShallow({
		id,
		message: raw.Msg,
		customID: raw.Type === 0 ? undefined : raw.Type.toString(),
		type: 'broadcasted',

		senderID: raw.Sender.toString(),
		origin: raw.Origin,

		expirationDate: raw.Expires,
		ignoreUntilDate: raw.IgnoreUntil,
		sentDate: raw.Sent,
	});

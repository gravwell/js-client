/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Notification, RawNotification, toNotification } from '~/models';
import { RawNumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetMyNotifications = (context: APIContext) => {
	const templatePath = '/api/notifications';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Notification>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const rawRes = await context.fetch(url, { ...req, method: 'GET' });
		const rawObj = await parseJSONResponse<{ [id: RawNumericID]: RawNotification }>(rawRes);
		return Object.entries(rawObj).map<Notification>(([id, rawNotification]) =>
			toNotification(rawNotification, id.toString()),
		);
	};
};

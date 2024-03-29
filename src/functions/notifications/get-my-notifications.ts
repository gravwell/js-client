/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Notification } from '~/models/notification/notification';
import { RawNotification } from '~/models/notification/raw-notification';
import { toNotification } from '~/models/notification/to-notification';
import { RawNumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetMyNotifications = (context: APIContext): (() => Promise<Array<Notification>>) => {
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

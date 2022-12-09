/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { toRawUpdatableNotification, UpdatableNotification } from '~/models/notification';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetMyNotifications } from './get-my-notifications';

export const makeUpdateOneNotification = (context: APIContext) => {
	const getAllNotification = makeGetMyNotifications(context);

	return async (updatable: UpdatableNotification): Promise<void> => {
		try {
			const templatePath = '/api/notifications/{notificationID}';
			const url = buildURL(templatePath, {
				...context,
				protocol: 'http',
				pathParams: { notificationID: updatable.id },
			});

			const currentNotification = (await getAllNotification()).find(notification => notification.id === updatable.id);

			if (!currentNotification) {
				throw Error('The current Notification is not valid.');
			}
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableNotification(updatable, currentNotification)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

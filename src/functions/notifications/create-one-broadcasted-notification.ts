/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableBroadcastNotification } from '~/models/notification/creatable-broadcasted-notification';
import { toRawCreatableBroadcastedNotification } from '~/models/notification/to-raw-creatable-broadcasted-notification';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeCreateOneBroadcastedNotification = (
	context: APIContext,
): ((creatable: CreatableBroadcastNotification) => Promise<void>) => {
	const templatePath = '/api/notifications/broadcast';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (creatable: CreatableBroadcastNotification): Promise<void> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableBroadcastedNotification(creatable)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

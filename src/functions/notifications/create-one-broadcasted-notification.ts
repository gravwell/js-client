/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableBroadcastNotification, toRawCreatableBroadcastedNotification } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeCreateOneBroadcastedNotification = (context: APIContext) => {
	const templatePath = '/api/notifications/broadcast';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (creatable: CreatableBroadcastNotification): Promise<void> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(toRawCreatableBroadcastedNotification(creatable)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

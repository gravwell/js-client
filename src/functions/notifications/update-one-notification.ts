/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRawUpdatableNotification, UpdatableNotification } from '~/models/notification';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneNotification = (context: APIContext) => {
	return async (updatable: UpdatableNotification): Promise<void> => {
		try {
			const templatePath = '/api/notifications/{notificationID}';
			const url = buildURL(templatePath, {
				...context,
				protocol: 'http',
				pathParams: { notificationID: updatable.id },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableNotification(updatable)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

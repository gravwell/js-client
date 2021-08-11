/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeDeleteOneNotification = (context: APIContext) => async (notificationID: string): Promise<void> => {
	const templatePath = '/api/notifications/{notificationID}';
	const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { notificationID } });

	const req = buildHTTPRequestWithContextToken(context);

	const raw = await fetch(url, { ...req, method: 'DELETE' });
	return parseJSONResponse(raw, { expect: 'void' });
};

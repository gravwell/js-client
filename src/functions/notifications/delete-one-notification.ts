/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeDeleteOneNotification = (makerOptions: APIFunctionMakerOptions) => async (
	authToken: string | null,
	notificationID: string,
): Promise<void> => {
	const templatePath = '/api/notifications/{notificationID}';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { notificationID } });
	const baseRequestOptions: HTTPRequestOptions = {
		headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
	};
	const req = buildHTTPRequest(baseRequestOptions);

	const raw = await fetch(url, { ...req, method: 'DELETE' });
	return parseJSONResponse(raw, { expect: 'void' });
};

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

export const makeRestartWebServer = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/restart/webserver';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null): Promise<void> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		try {
			const raw = await fetch(url, { ...req, method: 'POST' });
			await parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error && err.message.includes('socket hang up')) return;
			throw err;
		}
	};
};

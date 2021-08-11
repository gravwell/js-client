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

export const makeSyncAllScriptLibraries = (context: APIContext) => {
	const templatePath = '/api/libs/pull';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<void> => {
		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

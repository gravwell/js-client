/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '../../value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeBackgroundOneSearch = (context: APIContext) => {
	return async (authToken: string | null, searchID: NumericID): Promise<void> => {
		const templatePath = '/api/searchctrl/{searchID}/background';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { searchID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'PATCH' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

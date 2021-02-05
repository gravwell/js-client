/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearch2, Search2, toSearch2 } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetOnePersistentSearchStatus = (context: APIContext) => {
	return async (searchID: NumericID): Promise<Search2> => {
		const templatePath = '/api/searchctrl/{searchID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { searchID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSearch2>(raw);
		return toSearch2(rawRes);
	};
};

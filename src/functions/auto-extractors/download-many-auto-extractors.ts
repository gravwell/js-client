/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '../../value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeDownloadManyAutoExtractors = (context: APIContext) => {
	return async (filter: AutoExtractorsFilter): Promise<string> => {
		const path = '/api/autoextractors/download';
		const url = buildURL(path, {
			...context,
			protocol: 'http',
			queryParams: {
				id: filter.ids,
			},
		});

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		return await parseJSONResponse(raw, { expect: 'text' });
	};
};

export interface AutoExtractorsFilter {
	ids: Array<UUID>;
}

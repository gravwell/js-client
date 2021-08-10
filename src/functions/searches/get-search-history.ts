/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearch, Search, toSearch } from '~/models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetSearchHistory = (context: APIContext) => {
	return async (filter: SearchHistoryFilter): Promise<Array<Search>> => {
		const baseURLOptions = { ...context, protocol: 'http' } as const;
		const url = ((): string => {
			switch (filter.target) {
				case 'myself': {
					const templatePath = '/api/searchhistory';
					return buildURL(templatePath, baseURLOptions);
				}
				case 'user': {
					const templatePath = '/api/searchhistory/user/{userID}';
					return buildURL(templatePath, baseURLOptions, { pathParams: { userID: filter.userID } });
				}
				case 'user related': {
					const templatePath = '/api/searchhistory/all/{userID}';
					return buildURL(templatePath, baseURLOptions, { pathParams: { userID: filter.userID } });
				}
				case 'group': {
					const templatePath = '/api/searchhistory/group/{groupID}';
					return buildURL(templatePath, baseURLOptions, { pathParams: { groupID: filter.groupID } });
				}
				case 'all': {
					const templatePath = '/api/searchhistory/all';
					return buildURL(templatePath, baseURLOptions);
				}
			}
		})();

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawSearches = (await parseJSONResponse<Array<RawSearch> | null>(raw)) ?? [];
		return rawSearches.map(toSearch);
	};
};

export type SearchHistoryFilter =
	| { target: 'myself' }
	| { target: 'all' }
	| { target: 'user'; userID: string }
	| { target: 'group'; groupID: string }
	| { target: 'user related'; userID: string };

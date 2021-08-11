/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchModule, SearchModule, toSearchModule } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeGetAllSearchModules = (context: APIContext) => {
	const templatePath = '/api/info/searchmodules';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<SearchModule>> => {
		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<RawResponse>(raw)) ?? [];
		return rawRes.map(toSearchModule);
	};
};

type RawResponse = null | Array<RawSearchModule>;

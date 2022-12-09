/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isEmpty } from 'lodash';
import { IndexerWell, RawIndexerWellResponse, toIndexerWell } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeGetAllIndexers = (context: APIContext) => {
	const templatePath = '/api/indexer/info';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<IndexerWell>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<RawIndexerWellResponse>(raw)) ?? {};

		return isEmpty(rawRes) ? [] : toIndexerWell(rawRes);
	};
};

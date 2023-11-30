/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isEmpty } from 'lodash';
import { IndexerWell } from '~/models/indexer/indexer-well';
import { RawIndexerWellResponse } from '~/models/indexer/raw-indexer-well';
import { toIndexerWell } from '~/models/indexer/to-indexer-well';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { fetch } from '../utils/fetch';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllIndexers = (context: APIContext): (() => Promise<Array<IndexerWell>>) => {
	const templatePath = '/api/stats/wellStats';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<IndexerWell>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<RawIndexerWellResponse>(raw)) ?? {};

		return isEmpty(rawRes) ? [] : toIndexerWell(rawRes);
	};
};

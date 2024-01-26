/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearch2 } from '~/models/search/raw-search2';
import { Search2 } from '~/models/search/search2';
import { toSearch2 } from '~/models/search/to-search2';
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOnePersistentSearchStatus =
	(context: APIContext) =>
	async (searchID: NumericID): Promise<Search2> => {
		const templatePath = '/api/searchctrl/{searchID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { searchID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSearch2>(raw);
		return toSearch2(rawRes);
	};

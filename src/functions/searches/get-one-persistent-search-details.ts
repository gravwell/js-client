/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects';
import { RawSearchDetails } from '../../models/search/raw-search-details';
import { SearchDetails } from '../../models/search/search-details';
import { toSearchDetails } from '../../models/search/to-search-details';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOnePersistentSearchDetails =
	(context: APIContext) =>
	async (searchID: NumericID): Promise<SearchDetails> => {
		const templatePath = '/api/searchctrl/{searchID}/details';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { searchID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSearchDetails>(raw);
		return toSearchDetails(rawRes);
	};
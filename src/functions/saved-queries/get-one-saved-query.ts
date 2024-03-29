/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSavedQuery } from '~/models/saved-query/raw-saved-query';
import { SavedQuery } from '~/models/saved-query/saved-query';
import { toSavedQuery } from '~/models/saved-query/to-saved-query';
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOneSavedQuery =
	(context: APIContext) =>
	async (savedQueryID: NumericID): Promise<SavedQuery> => {
		const templatePath = '/api/library/{savedQueryID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { savedQueryID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSavedQuery>(raw);
		return toSavedQuery(rawRes);
	};

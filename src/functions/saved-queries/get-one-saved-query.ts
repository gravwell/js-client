/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSavedQuery, SavedQuery, toSavedQuery } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetOneSavedQuery = (context: APIContext) => {
	return async (savedQueryID: NumericID): Promise<SavedQuery> => {
		const templatePath = '/api/library/{savedQueryID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { savedQueryID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSavedQuery>(raw);
		return toSavedQuery(rawRes);
	};
};

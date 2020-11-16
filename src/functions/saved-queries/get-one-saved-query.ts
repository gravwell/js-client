/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { SavedQuery, RawSavedQuery, toSavedQuery } from '../../models';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneSavedQuery = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, savedQueryID: NumericID): Promise<SavedQuery> => {
		const templatePath = '/api/library/{savedQueryID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { savedQueryID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSavedQuery>(raw);
		return toSavedQuery(rawRes);
	};
};

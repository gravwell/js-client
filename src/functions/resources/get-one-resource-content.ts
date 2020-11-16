/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneResourceContent = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, resourceID: ID): Promise<string> => {
		const path = '/api/resources/{resourceID}/raw';
		const url = buildURL(path, { ...makerOptions, protocol: 'http', pathParams: { resourceID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		return await parseJSONResponse(raw, { expect: 'text' });
	};
};

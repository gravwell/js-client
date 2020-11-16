/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawResource, Resource, toResource, isBlankRawResource } from '../../models';
import { UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneResource = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, resourceID: UUID): Promise<Resource> => {
		const resourcePath = '/api/resources/{resourceID}';
		const url = buildURL(resourcePath, { ...makerOptions, protocol: 'http', pathParams: { resourceID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawResource = await parseJSONResponse<RawResource>(raw);
		// gravwell/gravwell#2337 nº 3
		if (isBlankRawResource(rawResource)) throw new Error('Not found');
		return toResource(rawResource);
	};
};

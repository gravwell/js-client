/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeGetOneResourceContent = (context: APIContext) => {
	return async (resourceID: ID): Promise<string> => {
		const path = '/api/resources/{resourceID}/raw';
		const url = buildURL(path, { ...context, protocol: 'http', pathParams: { resourceID } });

		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		return await parseJSONResponse(raw, { expect: 'text' });
	};
};

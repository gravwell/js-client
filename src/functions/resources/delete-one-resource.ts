/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeDeleteOneResource = (context: APIContext) => {
	return async (resourceID: NumericID): Promise<void> => {
		const resourcePath = '/api/resources/{resourceID}';
		const url = buildURL(resourcePath, { ...context, protocol: 'http', pathParams: { resourceID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

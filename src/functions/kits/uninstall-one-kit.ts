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

export const makeUninstallOneKit = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, kitID: ID): Promise<void> => {
		const path = '/api/kits/{kitID}';
		const url = buildURL(path, { ...makerOptions, protocol: 'http', pathParams: { kitID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

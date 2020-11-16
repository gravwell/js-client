/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawRemoteKit, RemoteKit, toRemoteKit } from '../../models';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneRemoteKit = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, kitID: NumericID): Promise<RemoteKit> => {
		const templatePath = '/api/kits/remote/{kitID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { kitID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawRemoteKit>(raw);
		return toRemoteKit(rawRes);
	};
};

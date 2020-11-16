/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawRemoteKit, RemoteKit, toRemoteKit } from '../../models';
import { ID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeUploadOneRemoteKit = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, kitID: ID): Promise<RemoteKit> => {
		const resourcePath = '/api/kits';
		const url = buildURL(resourcePath, { ...makerOptions, protocol: 'http' });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify({ remote: kitID }),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawRemoteKit>(raw);
			return toRemoteKit(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

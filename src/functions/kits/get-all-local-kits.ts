/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LocalKit, RawLocalKit, toLocalKit } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeGetAllLocalKits = (context: APIContext) => {
	const path = '/api/kits';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<LocalKit>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawLocalKit> | null>(raw)) ?? [];
		return rawRes.map(toLocalKit);
	};
};

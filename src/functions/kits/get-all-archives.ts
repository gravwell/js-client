/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { KitArchive, RawKitArchive, toKitArchive } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';
import { isArray } from 'lodash';

export const makeGetKitArchives = (context: APIContext) => {
	return async (): Promise<Array<KitArchive>> => {
		const path = '/api/kits/build/history';
		const url = buildURL(path, { ...context, protocol: 'http' });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<Array<RawKitArchive>>(raw);
		return isArray(rawRes) ? rawRes.map(toKitArchive) : [];
	};
};

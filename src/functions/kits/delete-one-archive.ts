/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL } from '../utils';

export const makeDeleteOneKitArchive = (context: APIContext) => {
	return async (archiveID: string): Promise<boolean> => {
		const path = '/api/kits/build/history/' + archiveID;
		const url = buildURL(path, { ...context, protocol: 'http' });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const respnse = await context.fetch(url, { ...req, method: 'DELETE' });
		// The API response is empty so we just check on status
		return respnse.status === 200;
	};
};

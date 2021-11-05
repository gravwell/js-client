/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawUser, toUser, User } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOneUser = (context: APIContext) => {
	return async (userID: string): Promise<User> => {
		const templatePath = '/api/users/{userID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawUser>(raw);
		return toUser(rawRes);
	};
};

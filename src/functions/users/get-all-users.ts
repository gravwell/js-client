/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawUser, toUser, User } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetAllUsers = (context: APIContext) => {
	const templatePath = '/api/users';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<User>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawUser> | null>(raw)) ?? [];
		return rawRes.map(toUser);
	};
};

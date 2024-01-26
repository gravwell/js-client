/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawUser } from '~/models/user/raw-user';
import { toUser } from '~/models/user/to-user';
import { User } from '~/models/user/user';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetMyUser = (context: APIContext): (() => Promise<User>) => {
	const templatePath = '/api/info/whoami';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<User> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawUser>(raw);
		return toUser(rawRes);
	};
};

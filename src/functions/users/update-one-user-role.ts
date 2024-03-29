/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { UserRole } from '~/models/user/user';
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeUpdateOneUserRole =
	(context: APIContext) =>
	async (userID: NumericID, role: UserRole): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}/admin';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

			const req = buildHTTPRequestWithAuthFromContext(context);

			const method = role === 'admin' ? 'PUT' : 'DELETE';
			const raw = await context.fetch(url, { ...req, method });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

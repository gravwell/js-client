/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeUpdateOneUserLockedState =
	(context: APIContext) =>
	async (userID: NumericID, lock: boolean): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}/lock';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

			const req = buildHTTPRequestWithAuthFromContext(context);

			const method = lock ? 'PUT' : 'DELETE';
			const raw = await context.fetch(url, { ...req, method });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

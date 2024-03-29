/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull, isNumber } from 'lodash';
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeUpdateOneUserSearchGroup =
	(context: APIContext) =>
	async (userID: NumericID, groupID: NumericID | null): Promise<void> => {
		try {
			const path = '/api/users/{userID}/searchgroup';
			const url = buildURL(path, { ...context, protocol: 'http', pathParams: { userID } });

			// To remove the search group ID, we need to send a DELETE request
			if (isNull(groupID)) {
				const request = buildHTTPRequestWithAuthFromContext(context);
				const raws = await context.fetch(url, { ...request, method: 'DELETE' });
				return parseJSONResponse(raws, { expect: 'void' });
			}

			// To change the search group ID, we need to send a PUT request
			const body: UpdateOneUserSearchGroupRawRequest = {
				GID: isNumber(groupID) ? groupID : parseInt(groupID, 10),
			};

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(body),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

interface UpdateOneUserSearchGroupRawRequest {
	GID: number | null;
}

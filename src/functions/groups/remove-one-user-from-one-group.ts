/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeRemoveOneUserFromOneGroup =
	(context: APIContext) =>
	async (userID: NumericID, groupID: NumericID): Promise<void> => {
		const templatePath = '/api/users/{userID}/group/{groupID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID, groupID } });

		try {
			const req = buildHTTPRequestWithAuthFromContext(context);

			const raw = await context.fetch(url, { ...req, method: 'DELETE' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

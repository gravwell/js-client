/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, toRawNumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeAddOneUserToManyGroups =
	(context: APIContext) =>
	async (userID: NumericID, groupIDs: Array<NumericID>): Promise<void> => {
		const templatePath = '/api/users/{userID}/group';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify({ GIDs: groupIDs.map(toRawNumericID) }),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

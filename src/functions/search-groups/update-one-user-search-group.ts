/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNumber } from 'lodash';
import { NumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneUserSearchGroup = (context: APIContext) => {
	return async (userID: NumericID, groupID: NumericID): Promise<void> => {
		try {
			const path = '/api/users/{userID}/searchgroup';
			const url = buildURL(path, { ...context, protocol: 'http', pathParams: { userID } });

			const body: UpdateOneUserSearchGroupRawRequest = omitUndefinedShallow({
				GID: isNumber(groupID) ? groupID : parseInt(groupID, 10),
			});

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(body),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface UpdateOneUserSearchGroupRawRequest {
	GID: number;
}

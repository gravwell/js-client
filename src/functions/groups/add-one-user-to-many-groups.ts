/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeAddOneUserToManyGroups = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, userID: NumericID, groupIDs: Array<NumericID>): Promise<void> => {
		const templatePath = '/api/users/{userID}/group';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { userID } });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify({ GIDs: groupIDs.map(toRawNumericID) }),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

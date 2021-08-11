/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeUpdateOneUserLockedState = (context: APIContext) => {
	return async (userID: NumericID, lock: boolean): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}/lock';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

			const req = buildHTTPRequestWithContextToken(context);

			const method = lock ? 'PUT' : 'DELETE';
			const raw = await fetch(url, { ...req, method });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

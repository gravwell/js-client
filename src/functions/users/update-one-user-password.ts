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
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneUserPassword = (context: APIContext) => {
	return async (userID: NumericID, newPassword: string, currentPassword?: string): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}/pwd';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

			const body: UpdateOneUserPasswordRawRequest = omitUndefinedShallow({
				NewPass: newPassword,
				OrigPass: currentPassword,
			});
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(body),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface UpdateOneUserPasswordRawRequest {
	OrigPass?: string;
	NewPass: string;
}

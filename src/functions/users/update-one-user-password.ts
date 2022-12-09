/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneUserPassword =
	(context: APIContext) =>
	async (userID: NumericID, newPassword: string, currentPassword?: string): Promise<void> => {
		try {
			const templatePath = '/api/users/{userID}/pwd';
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

			const body: UpdateOneUserPasswordRawRequest = omitUndefinedShallow({
				NewPass: newPassword,
				OrigPass: currentPassword,
			});
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

interface UpdateOneUserPasswordRawRequest {
	OrigPass?: string;
	NewPass: string;
}

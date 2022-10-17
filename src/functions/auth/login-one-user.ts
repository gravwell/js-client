/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { JWT } from '~/models';
import { APIContext, buildHTTPRequest, buildURL, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeLoginOneUser = (context: APIContext) => {
	const templatePath = '/api/login';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (username: string, password: string): Promise<JWT> => {
		const baseRequestOptions: HTTPRequestOptions = {
			body: JSON.stringify({ User: username, Pass: password }),
			headers: { 'Content-Type': 'application/json' },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		try {
			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const data = await parseJSONResponse<RawResponse>(raw);
			if (data.LoginStatus === false) {
				throw Error(data.Reason);
			}
			return data.JWT;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

type RawResponse = RawSuccessResponse | RawErrorResponse;
interface RawSuccessResponse {
	LoginStatus: true;
	JWT: string;
}
interface RawErrorResponse {
	LoginStatus: false;
	Reason: string;
}

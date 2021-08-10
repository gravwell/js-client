/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevel, toRawLogLevel } from '~/models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeCreateOneLog = (context: APIContext) => {
	return async (level: LogLevel, message: string): Promise<void> => {
		const templatePath = '/api/logging/{lowerCaseRawLogLevel}';
		const lowerCaseRawLogLevel = toRawLogLevel(level).toLowerCase();
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { lowerCaseRawLogLevel } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
			body: JSON.stringify({ Body: message }),
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'POST' });
		const success = await parseJSONResponse<boolean>(raw);
		if (!success) throw Error(`Couldn't create the log`);
	};
};

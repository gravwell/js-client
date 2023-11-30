/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { LogLevel } from '~/models/log-level/log-level';
import { toRawLogLevel } from '~/models/log-level/to-raw-log-level';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeCreateOneLog = (context: APIContext): ((level: LogLevel, message: string) => Promise<void>) => {
	const templatePath = '/api/logging/{lowerCaseRawLogLevel}';

	return async (level: LogLevel, message: string): Promise<void> => {
		try {
			const lowerCaseRawLogLevel = toRawLogLevel(level).toLowerCase();
			const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { lowerCaseRawLogLevel } });

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify({ Body: message }),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const success = await parseJSONResponse<boolean>(raw);
			if (!success) {
				throw Error(`Couldn't create the log`);
			}
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

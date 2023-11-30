/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { LogLevels } from '~/models/log-level/log-levels';
import { RawLogLevels } from '~/models/log-level/raw-log-levels';
import { toLogLevels } from '~/models/log-level/to-log-levels';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetLogLevels = (context: APIContext): (() => Promise<LogLevels>) => {
	const templatePath = '/api/logging';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<LogLevels> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawLogLevels>(raw);
		return toLogLevels(rawRes);
	};
};

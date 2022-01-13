/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevels, RawLogLevels, toLogLevels } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetLogLevels = (context: APIContext) => {
	const templatePath = '/api/logging';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<LogLevels> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawLogLevels>(raw);
		return toLogLevels(rawRes);
	};
};

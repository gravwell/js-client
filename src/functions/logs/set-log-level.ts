/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevel, toRawLogLevel } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeSetLogLevel = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/logging';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, level: LogLevel | 'off'): Promise<void> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
			body: JSON.stringify({ Level: level === 'off' ? 'Off' : toRawLogLevel(level) }),
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'PUT' });
		await parseJSONResponse(raw, { expect: 'void' });
	};
};

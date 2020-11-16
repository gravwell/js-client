/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { LogLevel, RawLogLevel, toLogLevel } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetLogLevels = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/logging';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null): Promise<GetLogLevelsResponse> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<GetLogLevelsRawResponse>(raw);
		return toResponse(rawRes);
	};
};

export interface GetLogLevelsResponse {
	current: LogLevel | 'off';
	available: Array<LogLevel | 'off'>;
}

interface GetLogLevelsRawResponse {
	Current: RawLogLevel | 'Off';
	Levels: Array<RawLogLevel | 'Off'>;
}

const toResponse = (raw: GetLogLevelsRawResponse): GetLogLevelsResponse => ({
	current: raw.Current === 'Off' ? 'off' : toLogLevel(raw.Current),
	available: raw.Levels.map(l => (l === 'Off' ? 'off' : toLogLevel(l))),
});

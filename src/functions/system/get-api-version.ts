/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Version } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAPIVersion = (context: APIContext) => {
	const templatePath = '/api/version/';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<GetAPIVersionResponse> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<GetAPIVersionRawResponse>(raw);
		return toGetAPIVersionResponse(rawRes);
	};
};

export interface GetAPIVersionResponse {
	api: Version;
	// TODO: What's the difference between build and api?
	// gravwell/gravwell#2299
	build: Version & {
		id: string;
		releaseDate: Date;
	};
}

interface GetAPIVersionRawResponse {
	API: {
		Major: number;
		Minor: number;
	};
	Build: {
		Major: number;
		Minor: number;
		Point: number;
		BuildDate: string; // Timestamp
		BuildID: string; // Commit ID
	};
}

const toGetAPIVersionResponse = (raw: GetAPIVersionRawResponse): GetAPIVersionResponse => ({
	api: { major: raw.API.Major, minor: raw.API.Minor, patch: 0 },
	build: {
		major: raw.Build.Major,
		minor: raw.Build.Minor,
		patch: raw.Build.Point,
		id: raw.Build.BuildID,
		releaseDate: new Date(raw.Build.BuildDate),
	},
});

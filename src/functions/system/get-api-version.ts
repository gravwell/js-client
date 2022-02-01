/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Version } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetAPIVersion = (context: APIContext) => {
	const templatePath = '/api/version/';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<GetAPIVersionResponse> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
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
	codename: string | null; // release codename >= 4.3.0
	timezone: string | null; // timezone >= 4.3.0
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
	Codename: string | null; // release codename >= 4.3.0
	Timezone: string | null; // timezone >= 4.3.0
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
	codename: raw.Codename ?? null,
	timezone: raw.Timezone ?? null,
});

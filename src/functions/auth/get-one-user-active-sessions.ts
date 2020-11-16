/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneUserActiveSessions = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, userID: string): Promise<UserSessions> => {
		const templatePath = '/api/users/{userID}/sessions';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { userID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		try {
			const raw = await fetch(url, { ...req, method: 'GET' });
			const data = await parseJSONResponse<RawSuccessResponse>(raw);
			return beautifyResponse(data);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface RawSuccessResponse {
	UID: number;
	User: string;
	Sessions: Array<{
		Origin: string; // IP eg. "127.0.0.1"
		LastHit: string; // Timestamp eg. "2020-08-04T12:55:40.6312945Z"
		TempSession: boolean;
		Synced: boolean;
	}>;
}

export interface UserSessions {
	userID: string;
	username: string;
	sessions: Array<{
		origin: string;
		lastHit: string;
		isTemporary: boolean;
		isSynced: boolean;
	}>;
}

const beautifyResponse = (raw: RawSuccessResponse): UserSessions => ({
	userID: raw.UID.toString(),
	username: raw.User,
	sessions: raw.Sessions.map(s => ({
		origin: s.Origin,
		lastHit: s.LastHit,
		isTemporary: s.TempSession,
		isSynced: s.Synced,
	})),
});

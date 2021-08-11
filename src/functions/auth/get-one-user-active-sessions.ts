/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawUserSessions, toUserSessions, UserSessions } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeGetOneUserActiveSessions = (context: APIContext) => {
	return async (userID: string): Promise<UserSessions> => {
		const templatePath = '/api/users/{userID}/sessions';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });

		const req = buildHTTPRequestWithContextToken(context);

		try {
			const raw = await fetch(url, { ...req, method: 'GET' });
			const data = await parseJSONResponse<RawUserSessions>(raw);
			return toUserSessions(data);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

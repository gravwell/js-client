/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableUser, toRawCreatableUser, User } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse
} from '../utils';
import { makeGetOneUser } from './get-one-user';

export const makeCreateOneUser = (context: APIContext) => {
	const getOneUser = makeGetOneUser(context);

	const templatePath = '/api/users';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableUser): Promise<User> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableUser(data)),
			};
			const req = buildHTTPRequestWithContextToken(context, baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<number>(raw);

			const userID = rawID.toString();
			return await getOneUser(userID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

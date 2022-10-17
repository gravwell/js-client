/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UserPreferences } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeUpdateOneUserPreferences =
	(context: APIContext) =>
	async (userID: string, preferences: UserPreferences): Promise<void> => {
		const templatePath = '/api/users/{userID}/preferences';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { userID } });
		const baseRequestOptions: HTTPRequestOptions = {
			body: JSON.stringify(preferences ?? {}),
			headers: { 'Content-Type': 'application/json' },
		};
		const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

		const raw = await context.fetch(url, { ...req, method: 'PUT' });
		return parseJSONResponse(raw, { expect: 'void' });
	};

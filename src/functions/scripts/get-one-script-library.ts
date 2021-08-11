/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Script } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeGetOneScriptLibrary = (context: APIContext) => {
	return async (path: string, options: { repository?: string; commitID?: string } = {}): Promise<Script> => {
		const templatePath = '/api/libs';
		const url = buildURL(templatePath, {
			...context,
			protocol: 'http',
			queryParams: { path, repo: options.repository, commit: options.commitID },
		});

		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		return parseJSONResponse(raw, { expect: 'text' });
	};
};

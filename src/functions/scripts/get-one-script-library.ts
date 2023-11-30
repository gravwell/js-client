/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Script } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOneScriptLibrary =
	(context: APIContext) =>
	async (
		path: string,
		options: { repository?: string | undefined; commitID?: string | undefined } = {},
	): Promise<Script> => {
		const templatePath = '/api/libs';
		const url = buildURL(templatePath, {
			...context,
			protocol: 'http',
			queryParams: { path, repo: options.repository, commit: options.commitID },
		});

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		return parseJSONResponse(raw, { expect: 'text' });
	};

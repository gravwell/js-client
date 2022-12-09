/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Script } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

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

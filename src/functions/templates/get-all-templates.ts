/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawTemplate, Template, toTemplate } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllTemplates = (context: APIContext): (() => Promise<Array<Template>>) => {
	const templatePath = '/api/templates';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Template>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawTemplate> | null>(raw)) ?? [];
		return rawRes.map(toTemplate);
	};
};

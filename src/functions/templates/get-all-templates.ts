/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawTemplate, Template, toTemplate } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetAllTemplates = (context: APIContext) => {
	const templatePath = '/api/templates';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Template>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawTemplate> | null>(raw)) ?? [];
		return rawRes.map(toTemplate);
	};
};

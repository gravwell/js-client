/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawRenderModule } from '~/models/render-module/raw-render-module';
import { RenderModule } from '~/models/render-module/render-module';
import { toRenderModule } from '~/models/render-module/to-render-module';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllRenderModules = (context: APIContext): (() => Promise<Array<RenderModule>>) => {
	const templatePath = '/api/info/rendermodules';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<RenderModule>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<RawResponse>(raw)) ?? [];
		return rawRes.map(toRenderModule);
	};
};

type RawResponse = null | Array<RawRenderModule>;

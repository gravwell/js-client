/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { AutoExtractor } from '~/models/auto-extractor/auto-extractor';
import { RawAutoExtractor } from '~/models/auto-extractor/raw-auto-extractor';
import { toAutoExtractor } from '~/models/auto-extractor/to-auto-extractor';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAutoExtractorsAuthorizedToMe = (context: APIContext): (() => Promise<Array<AutoExtractor>>) => {
	const path = '/api/autoextractors';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<AutoExtractor>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawAutoExtractor> | null>(raw)) ?? [];
		return rawRes.map(toAutoExtractor);
	};
};

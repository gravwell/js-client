/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Macro } from '~/models/macro/macro';
import { RawMacro } from '~/models/macro/raw-macro';
import { toMacro } from '~/models/macro/to-macro';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetMacrosAuthorizedToMe = (context: APIContext): (() => Promise<Array<Macro>>) => {
	const path = '/api/macros';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<Macro>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawMacro> | null>(raw)) ?? [];
		return rawRes.map(toMacro);
	};
};

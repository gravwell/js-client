/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Macro, RawMacro, toMacro, toRawUpdatableMacro, UpdatableMacro } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneMacro } from './get-one-macro';

export const makeUpdateOneMacro = (context: APIContext): ((data: UpdatableMacro) => Promise<Macro>) => {
	const getOneMacro = makeGetOneMacro(context);

	return async (data: UpdatableMacro): Promise<Macro> => {
		const templatePath = '/api/macros/{macroID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { macroID: data.id } });

		try {
			const current = await getOneMacro(data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableMacro(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawMacro = await parseJSONResponse<RawMacro>(raw);
			return toMacro(rawMacro);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

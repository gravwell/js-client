/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableMacro, Macro, toRawCreatableMacro } from '~/models';
import { RawNumericID, toNumericID } from '~/value-objects';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneMacro } from './get-one-macro';

export const makeCreateOneMacro = (context: APIContext): ((data: CreatableMacro) => Promise<Macro>) => {
	const getOneMacro = makeGetOneMacro(context);

	const templatePath = '/api/macros';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableMacro): Promise<Macro> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableMacro(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawNumericID>(raw);
			const macroID = toNumericID(rawRes);
			return getOneMacro(macroID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

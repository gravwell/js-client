/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableTemplate } from '~/models/template/creatable-template';
import { RawTemplate } from '~/models/template/raw-template';
import { Template } from '~/models/template/template';
import { toRawCreatableTemplate } from '~/models/template/to-raw-creatable-template';
import { toTemplate } from '~/models/template/to-template';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeCreateOneTemplate = (context: APIContext): ((data: CreatableTemplate) => Promise<Template>) => {
	const templatePath = '/api/templates';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableTemplate): Promise<Template> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableTemplate(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawTemplate>(raw);

			return toTemplate(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

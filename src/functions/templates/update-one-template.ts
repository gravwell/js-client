/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawTemplate } from '~/models/template/raw-template';
import { Template } from '~/models/template/template';
import { toRawUpdatableTemplate } from '~/models/template/to-raw-updatable-template';
import { toTemplate } from '~/models/template/to-template';
import { UpdatableTemplate } from '~/models/template/updatable-template';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneTemplate } from './get-one-template';

export const makeUpdateOneTemplate = (context: APIContext): ((data: UpdatableTemplate) => Promise<Template>) => {
	const getOneTemplate = makeGetOneTemplate(context);

	return async (data: UpdatableTemplate): Promise<Template> => {
		try {
			const current = await getOneTemplate(data.id);

			const templatePath = '/api/templates/{templateID}';
			const url = buildURL(templatePath, {
				...context,
				protocol: 'http',
				pathParams: { templateID: data.id },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableTemplate(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
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

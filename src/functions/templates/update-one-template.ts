/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawTemplate, Template, toRawUpdatableTemplate, toTemplate, UpdatableTemplate } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneTemplate } from './get-one-template';

export const makeUpdateOneTemplate = (context: APIContext) => {
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
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawTemplate>(raw);
			return toTemplate(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

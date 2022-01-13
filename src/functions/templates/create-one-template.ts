/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableTemplate, Template, toRawCreatableTemplate } from '~/models';
import { UUID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneTemplate } from './get-one-template';

export const makeCreateOneTemplate = (context: APIContext) => {
	const getOneTemplate = makeGetOneTemplate(context);

	const templatePath = '/api/templates';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableTemplate): Promise<Template> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableTemplate(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<UUID>(raw);

			const templateID = rawID.toString();
			return await getOneTemplate(templateID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

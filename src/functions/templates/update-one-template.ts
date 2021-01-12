/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawTemplate, Template, toRawUpdatableTemplate, toTemplate, UpdatableTemplate } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneTemplate } from './get-one-template';

export const makeUpdateOneTemplate = (makerOptions: APIFunctionMakerOptions) => {
	const getOneTemplate = makeGetOneTemplate(makerOptions);

	return async (authToken: string | null, data: UpdatableTemplate): Promise<Template> => {
		try {
			const current = await getOneTemplate(authToken, data.uuid);

			const templatePath = '/api/templates/{templateID}';
			const url = buildURL(templatePath, {
				...makerOptions,
				protocol: 'http',
				pathParams: { templateID: data.uuid },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableTemplate(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawTemplate>(raw);
			return toTemplate(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

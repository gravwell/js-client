/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawTemplate, Template, toTemplate } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOneTemplate = (context: APIContext) => {
	return async (templateID: NumericID): Promise<Template> => {
		const templatePath = '/api/templates/{templateID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { templateID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawTemplate>(raw);
		return toTemplate(rawRes);
	};
};

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
import { toTemplate } from '~/models/template/to-template';
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOneTemplate =
	(context: APIContext) =>
	async (templateID: NumericID): Promise<Template> => {
		const templatePath = '/api/templates/{templateID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { templateID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawTemplate>(raw);
		return toTemplate(rawRes);
	};

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawValidatedScript } from '~/models/script/raw-validated-script';
import { Script } from '~/models/script/script';
import { toValidatedScript } from '~/models/script/to-validated-script';
import { ValidatedScript } from '~/models/script/validated-script';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeValidateOneScript = (context: APIContext): ((script: Script) => Promise<ValidatedScript>) => {
	const templatePath = '/api/scheduledsearches/parse';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (script: Script): Promise<ValidatedScript> => {
		const baseRequestOptions: HTTPRequestOptions = {
			body: JSON.stringify({ Script: script }),
			headers: { 'Content-Type': 'application/json' },
		};
		const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

		const raw = await context.fetch(url, { ...req, method: 'PUT' });
		const rawRes = await parseJSONResponse<RawValidatedScript>(raw);
		return toValidatedScript(rawRes);
	};
};

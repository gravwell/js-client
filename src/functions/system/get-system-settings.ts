/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSystemSettings } from '~/models/system-settings/raw-system-settings';
import { SystemSettings } from '~/models/system-settings/system-settings';
import { toSystemSettings } from '~/models/system-settings/to-system-settings';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetSystemSettings = (context: APIContext): (() => Promise<SystemSettings>) => {
	const templatePath = '/api/settings';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<SystemSettings> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawSystemSettings>(raw);
		return toSystemSettings(rawRes);
	};
};

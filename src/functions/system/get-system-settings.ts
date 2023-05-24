/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSystemSettings, SystemSettings, toSystemSettings } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

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

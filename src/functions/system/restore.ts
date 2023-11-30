/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import * as FormData from 'form-data';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { File } from '../utils/file';
import { HTTPRequestOptions } from '../utils/http-request-options';

export const makeRestore = (context: APIContext): ((backup: File, signal?: AbortSignal) => Promise<void>) => {
	const templatePath = '/api/backup';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (backup: File, signal?: AbortSignal): Promise<void> => {
		const form = new FormData();
		form.append('backup', backup);

		const baseRequestOptions: HTTPRequestOptions = {
			body: form as any,
		};
		const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

		const init = { ...req, method: 'POST' };
		if (signal) {
			init.signal = signal;
		}

		await context.fetch(url, init);
	};
};

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, File, HTTPRequestOptions } from '../utils';

export const makeRestore = (context: APIContext) => {
	const templatePath = '/api/backup';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (backup: File, signal?: AbortSignal): Promise<void> => {
		const form = new FormData();
		form.append('backup', backup);

		const baseRequestOptions: HTTPRequestOptions = {
			body: form as any,
		};
		const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);
		await context.fetch(url, { ...req, method: 'POST', signal });
	};
};

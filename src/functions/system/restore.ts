/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { APIContext, buildHTTPRequest, buildURL, fetch, File, HTTPRequestOptions } from '../utils';

export const makeRestore = (context: APIContext) => {
	const templatePath = '/api/backup';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (backup: File, signal?: AbortSignal): Promise<void> => {
		const form = new FormData();
		form.append('backup', backup);

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
			body: form as any,
		};
		const req = buildHTTPRequest(baseRequestOptions);
		await fetch(url, { ...req, method: 'POST', signal });
	};
};

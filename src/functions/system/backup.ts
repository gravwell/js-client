/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL } from '../utils';

export const makeBackup = (context: APIContext) => {
	const templatePath = '/api/backup';

	return async (includeSavedSearches = false): Promise<File> => {
		const url = buildURL(templatePath, {
			...context,
			queryParams: { savedsearch: includeSavedSearches },
			protocol: 'http',
		});

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });

		const matches = raw.headers.get('content-disposition')?.match(/^attachment; filename="(?<name>.*)"$/);
		const filename = matches?.groups?.name ?? 'GravwellBackup.gravbak';

		return raw.blob().then(blob => new File([blob], filename));
	};
};

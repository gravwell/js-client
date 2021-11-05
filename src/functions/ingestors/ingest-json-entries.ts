/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableJSONEntry, toRawCreatableJSONEntry } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeIngestJSONEntries = (context: APIContext) => {
	const templatePath = '/api/ingest/json';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (entries: Array<CreatableJSONEntry>): Promise<number> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(entries.map(toRawCreatableJSONEntry)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableJSONEntry } from '~/models/entry/creatable-json-entry';
import { toRawCreatableJSONEntry } from '~/models/entry/to-raw-creatable-json-entry';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeIngestJSONEntries = (
	context: APIContext,
): ((entries: Array<CreatableJSONEntry>) => Promise<number>) => {
	const templatePath = '/api/ingest/json';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (entries: Array<CreatableJSONEntry>): Promise<number> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(entries.map(toRawCreatableJSONEntry)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

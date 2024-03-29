/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableMultiLineEntry } from '~/models/entry/creatable-multi-line-entry';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeIngestMultiLineEntry = (
	context: APIContext,
): ((entry: CreatableMultiLineEntry) => Promise<number>) => {
	const templatePath = '/api/ingest/lines';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (entry: CreatableMultiLineEntry): Promise<number> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: toFormData(entry) as any,
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

const toFormData = (creatable: CreatableMultiLineEntry): FormData => {
	const formData = new FormData();
	formData.append('tag', creatable.tag);
	if (creatable.skipTimestampParsing) {
		formData.append('noparsetimestamp', 'true');
	}
	if (creatable.assumeLocalTimezone) {
		formData.append('assumelocaltimezone', 'true');
	}

	// !WARNING: Adding an empty line at the end because gravwell/gravwell#2285
	const blob = new Blob([creatable.data + '\n'], { type: 'text/plain' });
	formData.append('file', blob, 'doesnt-matter.txt');

	return formData;
};

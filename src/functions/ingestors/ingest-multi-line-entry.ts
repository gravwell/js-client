/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { CreatableMultiLineEntry } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeIngestMultiLineEntry = (context: APIContext) => {
	const templatePath = '/api/ingest/lines';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (entry: CreatableMultiLineEntry): Promise<number> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: toFormData(entry) as any,
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

const toFormData = (creatable: CreatableMultiLineEntry): FormData => {
	const formData = new FormData();
	formData.append('tag', creatable.tag);
	// !WARNING: Adding an empty line at the end because gravwell/gravwell#2285
	formData.append('file', creatable.data + '\n', { filename: 'doesnt-matter.txt' });
	if (creatable.skipTimestampParsing) formData.append('noparsetimestamp', true);
	if (creatable.assumeLocalTimezone) formData.append('assumelocaltimezone', true);
	return formData;
};

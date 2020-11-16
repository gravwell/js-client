/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeIngestMultiLineEntry = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/ingest/lines';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, entry: CreatableMultiLineEntry): Promise<number> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
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

export interface CreatableMultiLineEntry {
	/**
	 * The string tag to be used (e.g. "syslog")
	 */
	tag: string;

	/**
	 *  The lines to be ingested
	 */
	data: string;

	/**
	 * Setting this to "true" will force entries to be ingested with the current timestamp rather than attempting to parse one from each entry.
	 */
	skipTimestampParsing?: boolean;

	/**
	 * Setting this to "true" means timestamps extracted from entries will assume to be in the local timezone (instead of UTC) if the timezone is not explicitly specified.
	 */
	assumeLocalTimezone?: boolean;
}

const toFormData = (creatable: CreatableMultiLineEntry): FormData => {
	const formData = new FormData();
	formData.append('tag', creatable.tag);
	// !WARNING: Adding an empty line at the end because gravwell/gravwell#2285
	formData.append('file', creatable.data + '\n', { filename: 'doesnt-matter.txt' });
	if (creatable.skipTimestampParsing) formData.append('noparsetimestamp', true);
	if (creatable.assumeLocalTimezone) formData.append('assumelocaltimezone', true);
	return formData;
};

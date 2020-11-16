/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { encode as base64Encode } from 'base-64';
import { encode as utf8Encode } from 'utf8';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeIngestJSONEntries = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/ingest/json';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, entries: Array<CreatableJSONEntry>): Promise<number> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(entries.map(toCreatableRaw)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			return parseJSONResponse(raw);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableJSONEntry {
	/**
	 * A timestamp (e.g. "2018-02-12T11:06:44.215431364-07:00")
	 */
	timestamp?: string;

	/**
	 * The string tag to be used (e.g. "syslog")
	 */
	tag: string;

	/**
	 *  Data in string UTF-8 format
	 */
	data: string;
}

export interface RawCreatableJSONEntry {
	/**
	 * A timestamp (e.g. "2018-02-12T11:06:44.215431364-07:00")
	 */
	TS: string;

	/**
	 * The string tag to be used (e.g. "syslog")
	 */
	Tag: string;

	/**
	 *  base64-encoded bytes (e.g. "Zm9vCg==")
	 */
	Data: string;
}

const toCreatableRaw = (creatable: CreatableJSONEntry): RawCreatableJSONEntry => ({
	TS: creatable.timestamp ?? new Date().toISOString(),
	Tag: creatable.tag,
	Data: base64Encode(utf8Encode(creatable.data)),
});

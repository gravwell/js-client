/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { decode as base64Decode } from 'base-64';

export const makePreviewOneResourceContent = (makerOptions: APIFunctionMakerOptions) => {
	return async (
		authToken: string | null,
		resourceID: UUID,
		options: { bytes?: number } = {},
	): Promise<ResourceContentPreview> => {
		const resourcePath = '/api/resources/{resourceID}/contenttype';
		const url = buildURL(resourcePath, {
			...makerOptions,
			protocol: 'http',
			pathParams: { resourceID },
			queryParams: { bytes: options.bytes },
		});

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawPreview = await parseJSONResponse<RawResourceContentPreview>(raw);
		return toResourceContentPreview(rawPreview);
	};
};

interface RawResourceContentPreview {
	ContentType: string; // eg. 'text/plain; charset=utf-8'
	Body: string; // base 64 encoded string
}

export interface ResourceContentPreview {
	contentType: string;
	body: string;
}

const toResourceContentPreview = (raw: RawResourceContentPreview): ResourceContentPreview => ({
	contentType: raw.ContentType,
	body: base64Decode(raw.Body),
});

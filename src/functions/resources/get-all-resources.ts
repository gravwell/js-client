/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawResource, Resource, toResource } from '~/models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAllResources = (context: APIContext) => {
	const resourcePath = '/api/resources?admin=true';
	const url = buildURL(resourcePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Omit<Resource, 'body'>>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawResource> | null>(raw)) ?? [];
		return rawRes.map(toResource);
	};
};

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil } from 'lodash';
import { AutoExtractor, RawAutoExtractor, toAutoExtractor } from '~/models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAutoExtractorForTag = (context: APIContext) => {
	return async (tag: string): Promise<AutoExtractor> => {
		const templatePath = '/api/autoextractors/find/{tag}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { tag } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawAx = await parseJSONResponse<RawAutoExtractor | null>(raw);
		if (isNil(rawAx)) {
			throw Error('Not found');
		}

		return toAutoExtractor(rawAx);
	};
};

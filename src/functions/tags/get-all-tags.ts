/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Tag } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetAllTags = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/tags';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (sessionToken: string | null): Promise<Array<Tag>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: sessionToken ? `Bearer ${sessionToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		return parseJSONResponse(raw);
	};
};

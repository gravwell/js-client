/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableActionable, toRawCreatableActionable } from '../../models';
import { UUID } from '../../value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeCreateOneActionable = (context: APIContext) => {
	const templatePath = '/api/pivots';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableActionable): Promise<UUID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(toRawCreatableActionable(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<UUID>(raw);
			return rawRes;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

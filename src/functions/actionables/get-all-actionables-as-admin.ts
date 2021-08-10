/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Actionable, RawActionable, toActionable } from '~/models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetAllActionablesAsAdmin = (context: APIContext) => {
	const templatePath = '/api/pivots?admin=true';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Actionable>> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawActionable> | null>(raw)) ?? [];
		return rawRes.map(toActionable);
	};
};

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Actionable, RawActionable, toActionable } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeGetOneActionable = (context: APIContext) => {
	return async (actionableID: NumericID): Promise<Actionable> => {
		const templatePath = '/api/pivots/{actionableID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { actionableID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawActionable>(raw);
		return toActionable(rawRes);
	};
};

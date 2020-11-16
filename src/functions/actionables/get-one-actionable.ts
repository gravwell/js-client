/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Actionable, RawActionable, toActionable } from '../../models';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneActionable = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, actionableID: NumericID): Promise<Actionable> => {
		const templatePath = '/api/pivots/{actionableID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { actionableID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawActionable>(raw);
		return toActionable(rawRes);
	};
};

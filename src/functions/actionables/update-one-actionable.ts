/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Actionable, RawActionable, toActionable, toRawUpdatableActionable, UpdatableActionable } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneActionable } from './get-one-actionable';

export const makeUpdateOneActionable = (makerOptions: APIFunctionMakerOptions) => {
	const getOneActionable = makeGetOneActionable(makerOptions);

	return async (authToken: string | null, data: UpdatableActionable): Promise<Actionable> => {
		try {
			const current = await getOneActionable(authToken, data.uuid);

			const templatePath = '/api/pivots/{actionableID}';
			const url = buildURL(templatePath, {
				...makerOptions,
				protocol: 'http',
				pathParams: { actionableID: data.uuid },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableActionable(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawActionable>(raw);
			return toActionable(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

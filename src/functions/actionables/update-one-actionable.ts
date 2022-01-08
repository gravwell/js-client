/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Actionable, RawActionable, toActionable, toRawUpdatableActionable, UpdatableActionable } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneActionable } from './get-one-actionable';

export const makeUpdateOneActionable = (context: APIContext) => {
	const getOneActionable = makeGetOneActionable(context);

	return async (data: UpdatableActionable): Promise<Actionable> => {
		try {
			const current = await getOneActionable(data.uuid);

			const templatePath = '/api/pivots/{actionableID}';
			const url = buildURL(templatePath, {
				...context,
				protocol: 'http',
				pathParams: { actionableID: data.uuid },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableActionable(data, current)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawActionable>(raw);
			return toActionable(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

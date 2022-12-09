/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Actionable, CreatableActionable, toRawCreatableActionable } from '~/models';
import { UUID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneActionable } from './get-one-actionable';

export const makeCreateOneActionable = (context: APIContext) => {
	const getOneActionable = makeGetOneActionable(context);

	const templatePath = '/api/pivots';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableActionable): Promise<Actionable> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableActionable(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<UUID>(raw);

			const actionableID = rawID.toString();
			return await getOneActionable(actionableID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

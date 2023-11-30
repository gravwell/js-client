/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Actionable } from '~/models/actionable/actionable';
import { RawActionable } from '~/models/actionable/raw-actionable';
import { toActionable } from '~/models/actionable/to-actionable';
import { toRawUpdatableActionable } from '~/models/actionable/to-raw-updatable-actionable';
import { UpdatableActionable } from '~/models/actionable/updatable-actionable';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneActionable } from './get-one-actionable';

export const makeUpdateOneActionable = (context: APIContext): ((data: UpdatableActionable) => Promise<Actionable>) => {
	const getOneActionable = makeGetOneActionable(context);

	return async (data: UpdatableActionable): Promise<Actionable> => {
		try {
			const current = await getOneActionable(data.id);

			const templatePath = '/api/pivots/{actionableID}';
			const url = buildURL(templatePath, {
				...context,
				protocol: 'http',
				pathParams: { actionableID: data.id },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableActionable(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawActionable>(raw);
			return toActionable(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

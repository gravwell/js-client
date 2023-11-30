/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup } from '~/models/group/creatable-group';
import { Group } from '~/models/group/group';
import { toRawCreatableGroup } from '~/models/group/to-raw-creatable-group';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneGroup } from './get-one-group';

export const makeCreateOneGroup = (context: APIContext): ((data: CreatableGroup) => Promise<Group>) => {
	const getOneGroup = makeGetOneGroup(context);

	const templatePath = '/api/groups';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableGroup): Promise<Group> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableGroup(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<number>(raw);

			const groupID = rawID.toString();
			return await getOneGroup(groupID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

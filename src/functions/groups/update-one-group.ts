/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Group } from '~/models/group/group';
import { toRawUpdatableGroup } from '~/models/group/to-raw-updatable-group';
import { UpdatableGroup } from '~/models/group/updatable-group';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneGroup } from './get-one-group';

export const makeUpdateOneGroup =
	(context: APIContext) =>
	async (data: UpdatableGroup): Promise<Group> => {
		const getOneGroup = makeGetOneGroup(context);

		const templatePath = '/api/groups/{groupID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { groupID: data.id } });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableGroup(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			await parseJSONResponse(raw, { expect: 'void' });
			return await getOneGroup(data.id);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

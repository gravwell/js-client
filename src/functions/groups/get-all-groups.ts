/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Group } from '~/models/group/group';
import { RawGroup } from '~/models/group/raw-group';
import { toGroup } from '~/models/group/to-group';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllGroups = (context: APIContext): (() => Promise<Array<Group>>) => {
	const templatePath = '/api/groups';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Group>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawGroup> | null>(raw)) ?? [];
		return rawRes.map(toGroup);
	};
};

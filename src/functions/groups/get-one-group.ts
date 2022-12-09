/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Group, RawGroup, toGroup } from '~/models';
import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOneGroup =
	(context: APIContext) =>
	async (groupID: NumericID): Promise<Group> => {
		const templatePath = '/api/groups/{groupID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { groupID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawGroup>(raw);
		return toGroup(rawRes);
	};

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
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

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

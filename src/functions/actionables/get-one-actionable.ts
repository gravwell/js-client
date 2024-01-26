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
import { NumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOneActionable =
	(context: APIContext) =>
	async (actionableID: NumericID): Promise<Actionable> => {
		const templatePath = '/api/pivots/{actionableID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { actionableID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawActionable>(raw);
		return toActionable(rawRes);
	};

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { LocalKit } from '~/models/kit/local-kit';
import { RawLocalKit } from '~/models/kit/raw-local-kit';
import { toLocalKit } from '~/models/kit/to-local-kit';
import { NumericID } from '~/value-objects';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOneLocalKit =
	(context: APIContext) =>
	async (kitID: NumericID): Promise<LocalKit> => {
		const templatePath = '/api/kits/{kitID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { kitID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawLocalKit>(raw);
		return toLocalKit(rawRes);
	};

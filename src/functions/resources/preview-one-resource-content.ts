/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawResourceContentPreview, ResourceContentPreview, toResourceContentPreview } from '~/models';
import { UUID } from '~/value-objects';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makePreviewOneResourceContent =
	(context: APIContext) =>
	async (resourceID: UUID, options: { bytes?: number | undefined } = {}): Promise<ResourceContentPreview> => {
		const resourcePath = '/api/resources/{resourceID}/contenttype';
		const url = buildURL(resourcePath, {
			...context,
			protocol: 'http',
			pathParams: { resourceID },
			queryParams: { bytes: options.bytes },
		});

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawPreview = await parseJSONResponse<RawResourceContentPreview>(raw);
		return toResourceContentPreview(rawPreview);
	};

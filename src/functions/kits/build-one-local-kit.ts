/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { BuildableKit } from '~/models/kit/buildable-kit';
import { toRawBuildableKit } from '~/models/kit/to-raw-buildable-kit';
import { RawNumericID, RawUUID, UUID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeBuildOneLocalKit = (context: APIContext): ((data: BuildableKit) => Promise<UUID>) => {
	const templatePath = '/api/kits/build';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: BuildableKit): Promise<UUID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawBuildableKit(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<BuildOneKitRawResponse>(raw);
			return rawRes.UUID;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

interface BuildOneKitRawResponse {
	Size: number;
	UID: RawNumericID;
	UUID: RawUUID;
}

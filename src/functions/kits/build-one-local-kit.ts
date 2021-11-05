/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { BuildableKit, toRawBuildableKit } from '~/models';
import { RawNumericID, RawUUID, UUID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeBuildOneLocalKit = (context: APIContext) => {
	const templatePath = '/api/kits/build';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: BuildableKit): Promise<UUID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawBuildableKit(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<BuildOneKitRawResponse>(raw);
			return rawRes.UUID;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface BuildOneKitRawResponse {
	Size: number;
	UID: RawNumericID;
	UUID: RawUUID;
}

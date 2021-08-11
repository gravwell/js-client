/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { AutoExtractorModule, RawAutoExtractorModule } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	parseJSONResponse
} from '../utils';

export const makeGetAllAutoExtractorModules = (context: APIContext) => {
	const path = '/api/autoextractors/engines';
	const url = buildURL(path, { ...context, protocol: 'http' });

	return async (): Promise<Array<AutoExtractorModule>> => {
		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawAutoExtractorModule> | null>(raw)) ?? [];
		return rawRes;
	};
};

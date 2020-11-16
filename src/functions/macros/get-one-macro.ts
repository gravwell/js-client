/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Macro, RawMacro, toMacro } from '../../models';
import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeGetOneMacro = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, macroID: NumericID): Promise<Macro> => {
		const templatePath = '/api/macros/{macroID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { macroID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawMacro>(raw);
		return toMacro(rawRes);
	};
};

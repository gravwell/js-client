/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeDeleteOneMacro = (context: APIContext) => {
	return async (macroID: NumericID): Promise<void> => {
		const templatePath = '/api/macros/{macroID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { macroID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

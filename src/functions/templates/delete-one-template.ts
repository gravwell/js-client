/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithContextToken, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeDeleteOneTemplate = (context: APIContext) => {
	return async (templateID: NumericID): Promise<void> => {
		const templatePath = '/api/templates/{templateID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { templateID } });

		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

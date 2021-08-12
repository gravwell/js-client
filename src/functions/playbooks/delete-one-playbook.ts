/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeDeleteOnePlaybook = (context: APIContext) => {
	return async (playbookID: NumericID): Promise<void> => {
		const playbookPath = '/api/playbooks/{playbookID}';
		const url = buildURL(playbookPath, { ...context, protocol: 'http', pathParams: { playbookID } });
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions } from '../utils';

export const makeStopOneSearch = (context: APIContext) => {
	return async (searchID: NumericID): Promise<void> => {
		const templatePath = '/api/searchctrl/{searchID}/stop';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { searchID } });
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		await fetch(url, { ...req, method: 'PUT' });
	};
};

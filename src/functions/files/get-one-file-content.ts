/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithContextToken, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeGetOneFileContent = (context: APIContext) => {
	return async (fileID: UUID): Promise<string> => {
		const templatePath = '/api/files/{fileID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { fileID } });

		const req = buildHTTPRequestWithContextToken(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		return parseJSONResponse(raw, { expect: 'text' });
	};
};

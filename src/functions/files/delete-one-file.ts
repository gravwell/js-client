/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

// !WARNING gravwell/gravwell#2505 can't use ThingUUID
export const makeDeleteOneFile =
	(context: APIContext) =>
	async (fileID: UUID): Promise<void> => {
		const templatePath = '/api/files/{fileID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { fileID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};

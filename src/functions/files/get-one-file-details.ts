/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { FileMetadata, RawFileMetadata, toFileMetadata } from '~/models';
import { NumericID } from '../../value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetOneFileDetails =
	(context: APIContext) =>
	async (fileID: NumericID): Promise<FileMetadata> => {
		const templatePath = '/api/files/{fileID}/details';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { fileID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawFileMetadata>(raw);
		return toFileMetadata(rawRes);
	};

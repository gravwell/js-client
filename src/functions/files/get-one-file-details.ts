/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { FileMetadata } from '~/models/file/file-metadata';
import { RawFileMetadata } from '~/models/file/raw-file-metadata';
import { toFileMetadata } from '~/models/file/to-file-metadata';
import { NumericID } from '../../value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

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

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import * as FormData from 'form-data';
import { isString } from 'lodash';
import { LocalKit } from '~/models/kit/local-kit';
import { RawLocalKit } from '~/models/kit/raw-local-kit';
import { toLocalKit } from '~/models/kit/to-local-kit';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { File } from '../utils/file';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeUploadOneLocalKit =
	(context: APIContext) =>
	async (kit: File): Promise<LocalKit> => {
		const resourcePath = '/api/kits';
		const url = buildURL(resourcePath, { ...context, protocol: 'http' });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: toFormData(kit) as any,
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawLocalKit>(raw);
			return toLocalKit(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

const toFormData = (file: File): FormData => {
	const formData = new FormData();
	formData.append('file', ...parseFile(file));
	return formData;
};

const parseFile = (file: File): [any, FormData.AppendOptions?] =>
	isString(file) ? [file, { filename: 'whatever.txt' }] : [file];

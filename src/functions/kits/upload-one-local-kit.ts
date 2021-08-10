/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { isString } from 'lodash';
import { LocalKit, RawLocalKit, toLocalKit } from '~/models';
import { APIContext, buildHTTPRequest, buildURL, fetch, File, HTTPRequestOptions, parseJSONResponse } from '../utils';

export const makeUploadOneLocalKit = (context: APIContext) => {
	return async (kit: File): Promise<LocalKit> => {
		const resourcePath = '/api/kits';
		const url = buildURL(resourcePath, { ...context, protocol: 'http' });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: toFormData(kit) as any,
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawLocalKit>(raw);
			return toLocalKit(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

const toFormData = (file: File): FormData => {
	const formData = new FormData();
	formData.append('file', ...parseFile(file));
	return formData;
};

const parseFile = (file: File): [any, FormData.AppendOptions?] =>
	isString(file) ? [file, { filename: 'whatever.txt' }] : [file];

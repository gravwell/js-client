/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { isString } from 'lodash';
import { RawResource, Resource, toResource } from '~/models';
import { UUID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithContextToken,
	buildURL,
	fetch,
	File,
	HTTPRequestOptions,
	parseJSONResponse
} from '../utils';

export const makeSetOneResourceContent = (context: APIContext) => {
	return async (resourceID: UUID, file: File): Promise<Resource> => {
		const resourcePath = '/api/resources/{resourceID}/raw';
		const url = buildURL(resourcePath, { ...context, protocol: 'http', pathParams: { resourceID } });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: toFormData(file) as any,
			};
			const req = buildHTTPRequestWithContextToken(context, baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawResource>(raw);
			return toResource(rawRes);
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

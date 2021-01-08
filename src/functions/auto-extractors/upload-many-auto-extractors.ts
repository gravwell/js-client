/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { isString } from 'lodash';
import { AutoExtractor, UpdatableAutoExtractor } from '../../models';
import { NumericID, RawUUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	File,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeUpdateOneAutoExtractor } from './update-one-auto-extractor';

export const makeUploadManyAutoExtractors = (makerOptions: APIFunctionMakerOptions) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(makerOptions);
	const updateOneAutoExtractor = makeUpdateOneAutoExtractor(makerOptions);

	const resourcePath = '/api/autoextractors/upload';
	const url = buildURL(resourcePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: UploadableAutoExtractor): Promise<Array<AutoExtractor>> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: toFormData(data.file) as any,
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const createdIDs = new Set(await parseJSONResponse<Array<RawUUID>>(raw));

			// Only upload and return it
			const uploaded = await getAllAutoExtractors(authToken).then(aes => aes.filter(ae => createdIDs.has(ae.id)));
			const dataKeys = Object.keys(data);
			if (dataKeys.length === 1 && dataKeys.includes('file')) return uploaded;

			// Upload and also change some access properties
			return Promise.all(
				uploaded.map(ae => {
					const updatable: UpdatableAutoExtractor = { id: ae.id, ...data };
					return updateOneAutoExtractor(authToken, updatable);
				}),
			);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UploadableAutoExtractor {
	file: File;

	groupIDs?: Array<NumericID>;
	labels?: Array<string>;
	isGlobal?: boolean;
}

const toFormData = (file: File): FormData => {
	const formData = new FormData();
	formData.append('extraction', ...parseFile(file));
	return formData;
};

const parseFile = (file: File): [any, FormData.AppendOptions?] =>
	isString(file) ? [file, { filename: 'whatever.txt' }] : [file];

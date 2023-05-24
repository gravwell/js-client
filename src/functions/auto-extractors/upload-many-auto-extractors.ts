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
import { AutoExtractor, UpdatableAutoExtractor, UploadableAutoExtractor } from '~/models';
import { RawUUID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	File,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeUpdateOneAutoExtractor } from './update-one-auto-extractor';

export const makeUploadManyAutoExtractors = (
	context: APIContext,
): ((data: UploadableAutoExtractor) => Promise<Array<AutoExtractor>>) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(context);
	const updateOneAutoExtractor = makeUpdateOneAutoExtractor(context);

	const resourcePath = '/api/autoextractors/upload';
	const url = buildURL(resourcePath, { ...context, protocol: 'http' });

	return async (data: UploadableAutoExtractor): Promise<Array<AutoExtractor>> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: toFormData(data.file) as any,
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const createdIDs = new Set(await parseJSONResponse<Array<RawUUID>>(raw));

			// Only upload and return it
			const uploaded = await getAllAutoExtractors().then(aes => aes.filter(ae => createdIDs.has(ae.id)));
			const dataKeys = Object.keys(data);
			if (dataKeys.length === 1 && dataKeys.includes('file')) {
				return uploaded;
			}

			// Upload and also change some access properties
			return Promise.all(
				uploaded.map(ae => {
					const updatable: UpdatableAutoExtractor = { id: ae.id, ...data };
					return updateOneAutoExtractor(updatable);
				}),
			);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

const toFormData = (file: File): FormData => {
	const formData = new FormData();
	formData.append('extraction', ...parseFile(file));
	return formData;
};

const parseFile = (file: File): [any, FormData.AppendOptions?] =>
	isString(file) ? [file, { filename: 'whatever.txt' }] : [file];

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import * as FormData from 'form-data';
import { isString, pick } from 'lodash';
import { CreatableFile, FileMetadata, RawBaseFileMetadata, toRawCreatableFile } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneFileDetails } from './get-one-file-details';
import { makeUpdateOneFile } from './update-one-file';

export const makeCreateOneFile = (context: APIContext) => {
	const updateOneFile = makeUpdateOneFile(context);
	const getOneFile = makeGetOneFileDetails(context);

	const filesPath = '/api/files';
	const url = buildURL(filesPath, { ...context, protocol: 'http' });

	return async (data: CreatableFile): Promise<FileMetadata> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: toFormData(data) as any,
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawBaseFileMetadata>(raw);
			const fileID = rawRes.ThingUUID;

			// !WARNING: Can't set all properties on file creation gravwell/gravwell#2506
			const updateProps: Array<keyof CreatableFile> = ['globalID', 'groupIDs', 'userID', 'isGlobal', 'labels'];
			const needsUpdate = Object.keys(data).some(k => updateProps.includes(k as keyof CreatableFile));
			if (needsUpdate) {
				return updateOneFile({ ...pick(data, updateProps), id: fileID });
			}

			return getOneFile(fileID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

const toFormData = (data: CreatableFile): FormData => {
	const raw = toRawCreatableFile(data);
	const formData = new FormData();
	if (isString(raw.guid)) {
		formData.append('guid', raw.guid);
	}
	formData.append('name', raw.name);
	formData.append('desc', raw.desc);
	formData.append('file', raw.file);
	return formData;
};

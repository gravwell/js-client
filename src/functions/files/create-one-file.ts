/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { isString, pick } from 'lodash';
import { FileMetadata, RawBaseFileMetadata } from '../../models';
import { NumericID, RawUUID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	File,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';
import { makeGetOneFile } from './get-one-file';
import { makeUpdateOneFile } from './update-one-file';

export const makeCreateOneFile = (makerOptions: APIFunctionMakerOptions) => {
	const updateOneFile = makeUpdateOneFile(makerOptions);
	const getOneFile = makeGetOneFile(makerOptions);

	const templatePath = '/api/files';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableFile): Promise<FileMetadata> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: toFormData(data) as any,
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawBaseFileMetadata>(raw);
			const globalID = rawRes.GUID;

			// !WARNING: Can't set all properties on file creation gravwell/gravwell#2506
			const updateProps: Array<keyof CreatableFile> = ['globalID', 'groupIDs', 'isGlobal', 'labels'];
			const needsUpdate = Object.keys(data).some(k => updateProps.includes(k as keyof CreatableFile));
			if (needsUpdate) return updateOneFile(authToken, { ...pick(data, updateProps), id: globalID });

			return getOneFile(authToken, globalID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableFile {
	globalID?: UUID;

	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;

	name: string;
	description?: string | null;
	labels?: Array<string>;

	file: File;
}

export interface RawCreatableFile {
	/**
	 * Optional global ID for this file. If not set, one will be generated.
	 */
	guid?: RawUUID;

	/**
	 * Body of the file.
	 */
	file: File;

	/**
	 * Name of the file.
	 */
	name: string;

	/**
	 * Description of the file.
	 */
	desc: string;
}

export const toRawCreatableFile = (data: CreatableFile): RawCreatableFile =>
	omitUndefinedShallow<RawCreatableFile>({
		guid: data.globalID,
		name: data.name,
		desc: data.description ?? '',
		file: data.file,
	});

const toFormData = (data: CreatableFile): FormData => {
	const raw = toRawCreatableFile(data);
	const formData = new FormData();
	if (isString(raw.guid)) formData.append('guid', raw.guid);
	formData.append('name', raw.name);
	formData.append('desc', raw.desc);
	formData.append('file', raw.file);
	return formData;
};

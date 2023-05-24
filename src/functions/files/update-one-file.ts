/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import * as FormData from 'form-data';
import { FileMetadata, RawBaseFileMetadata, toRawUpdatableFile, UpdatableFile } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneFileDetails } from './get-one-file-details';

export const makeUpdateOneFile = (context: APIContext): ((data: UpdatableFile) => Promise<FileMetadata>) => {
	const getOneFile = makeGetOneFileDetails(context);

	return async (data: UpdatableFile): Promise<FileMetadata> => {
		const templatePath = '/api/files/{fileID}?admin=true';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { fileID: data.id } });

		try {
			const current = await getOneFile(data.id);
			const updatedKeys = new Set(Object.keys(data)) as Set<keyof UpdatableFile>;

			const fileUpdate = async (): Promise<any> => {
				const targetedKeys: Array<keyof Required<UpdatableFile>> = ['file'];
				const hasTargetedKey = targetedKeys.some(key => updatedKeys.has(key));
				if (!hasTargetedKey) {
					return Promise.resolve();
				}

				const formData = new FormData();
				formData.append('file', data.file);

				const baseRequestOptions: HTTPRequestOptions = {
					body: formData as any,
				};
				const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

				const raw = await context.fetch(url, { ...req, method: 'PUT' });
				await parseJSONResponse<RawBaseFileMetadata>(raw);
			};

			const metadataUpdate = async (): Promise<any> => {
				const targetedKeys: Array<keyof Required<UpdatableFile>> = [
					'name',
					'description',
					'userID',
					'labels',
					'globalID',
					'groupIDs',
					'isGlobal',
				];
				const hasTargetedKey = targetedKeys.some(key => updatedKeys.has(key));
				if (!hasTargetedKey) {
					return Promise.resolve();
				}

				const baseRequestOptions: HTTPRequestOptions = {
					body: JSON.stringify(toRawUpdatableFile(data, current)),
					headers: { 'Content-Type': 'application/json' },
				};
				const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

				const raw = await context.fetch(url, { ...req, method: 'PATCH' });
				await parseJSONResponse<RawBaseFileMetadata>(raw);
			};

			await metadataUpdate();
			await fileUpdate();

			return getOneFile(data.id);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import * as FormData from 'form-data';
import { FileMetadata, RawBaseFileMetadata, toRawUpdatableFile, UpdatableFile } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneFile } from './get-one-file';

export const makeUpdateOneFile = (context: APIContext) => {
	const getOneFile = makeGetOneFile(context);

	return async (data: UpdatableFile): Promise<FileMetadata> => {
		const templatePath = '/api/files/{fileID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { fileID: data.id } });

		try {
			const current = await getOneFile(data.id);
			const updatedKeys = <Set<keyof UpdatableFile>>new Set(Object.keys(data));

			const metadataP = (async (): Promise<any> => {
				const targettedKeys: Array<keyof Required<UpdatableFile>> = [
					'name',
					'description',
					'labels',
					'globalID',
					'groupIDs',
					'isGlobal',
				];
				const hasTargettedKey = targettedKeys.some(key => updatedKeys.has(key));
				if (!hasTargettedKey) return Promise.resolve();

				const baseRequestOptions: HTTPRequestOptions = {
					body: JSON.stringify(toRawUpdatableFile(data, current)),
				};
				const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

				const raw = await context.fetch(url, { ...req, method: 'PATCH' });
				await parseJSONResponse<RawBaseFileMetadata>(raw);
			})();

			const fileP = (async (): Promise<any> => {
				const targettedKeys: Array<keyof Required<UpdatableFile>> = ['file'];
				const hasTargettedKey = targettedKeys.some(key => updatedKeys.has(key));
				if (!hasTargettedKey) return Promise.resolve();

				const formData = new FormData();
				formData.append('file', data.file);

				const baseRequestOptions: HTTPRequestOptions = {
					body: formData as any,
				};
				const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

				const raw = await context.fetch(url, { ...req, method: 'POST' });
				await parseJSONResponse<RawBaseFileMetadata>(raw);
			})();

			await Promise.all([metadataP, fileP]);
			return getOneFile(data.id);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

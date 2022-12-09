/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isUndefined } from 'lodash';
import { FileMetadata } from '~/models';
import { UUID } from '~/value-objects';
import { APIContext } from '../utils';
import { makeGetAllFiles } from './get-all-files';

export const makeGetOneFile = (context: APIContext) => {
	const getAllFiles = makeGetAllFiles(context);

	return async (fileID: UUID): Promise<FileMetadata> => {
		try {
			const all = await getAllFiles();
			const file = all.find(f => f.id === fileID || f.globalID === fileID);
			if (isUndefined(file)) {
				throw new Error('Not found');
			}
			return file;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models/data-type';
import { FileMetadata } from './file-metadata';
import { isFileMetadataData } from './is-file-metadata-data';

export const isFileMetadata = (value: unknown): value is FileMetadata => {
	try {
		const f = value as FileMetadata;
		return f._tag === DATA_TYPE.FILE_METADATA && isFileMetadataData(f);
	} catch {
		return false;
	}
};

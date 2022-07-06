/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { FileMetadataData } from './file-metadata-data';

export const isFileMetadataData = (value: unknown): value is FileMetadataData => {
	try {
		// TODO
		const f = <FileMetadataData>value;
		return !!f;
	} catch {
		return false;
	}
};

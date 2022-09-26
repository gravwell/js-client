/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { FileMetadata } from './file-metadata';
import { FileMetadataData } from './file-metadata-data';

export const fromFileMetadataDataToFileMetadata = (data: FileMetadataData): FileMetadata => ({
	...data,
	_tag: DATA_TYPE.FILE_METADATA,
});

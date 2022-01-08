/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableFile, FileMetadata, UpdatableFile } from '~/models/file';

export interface FilesService {
	readonly get: {
		readonly all: () => Promise<Array<FileMetadata>>;
		readonly authorizedTo: {
			readonly me: () => Promise<Array<FileMetadata>>;
		};
	};

	readonly create: {
		readonly one: (data: CreatableFile) => Promise<FileMetadata>;
	};

	readonly update: {
		readonly one: (data: UpdatableFile) => Promise<FileMetadata>;
	};

	readonly delete: {
		readonly one: (fileID: string) => Promise<void>;
	};
}

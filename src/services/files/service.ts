/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableFile } from '~/models/file/creatable-file';
import { FileMetadata } from '~/models/file/file-metadata';
import { UpdatableFile } from '~/models/file/updatable-file';

export interface FilesService {
	readonly get: {
		readonly one: (fileID: string) => Promise<FileMetadata>;
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

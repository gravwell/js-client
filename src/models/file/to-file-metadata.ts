/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { toNumericID } from '~/value-objects';
import { FileMetadata } from './file-metadata';
import { RawFileMetadata } from './raw-file-metadata';

export const toFileMetadata = (raw: RawFileMetadata): FileMetadata => ({
	_tag: DATA_TYPE.FILE_METADATA,
	id: raw.ThingUUID,
	globalID: raw.GUID,

	userID: toNumericID(raw.UID),
	groupIDs: (raw.GIDs ?? []).map(toNumericID),
	isGlobal: raw.Global ?? false,

	name: raw.Name,
	description: ((): string | null => {
		const trimmedDescription = raw.Desc.trim();
		return trimmedDescription === '' || trimmedDescription === 'undefined' ? null : trimmedDescription;
	})(),
	labels: raw.Labels ?? [],

	lastUpdateDate: new Date(raw.Updated),

	downloadURL: `/api/files/${raw.ThingUUID}`,
	size: raw.Size,
	contentType: raw.Type,
});

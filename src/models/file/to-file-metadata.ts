/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models/data-type';
import { toNumericID } from '~/value-objects/id';
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

	downloadURL: url(raw),
	size: raw.Size,
	contentType: raw.Type,
});

const isImage = (file: RawFileMetadata): boolean => file.Type.includes('image/');

/**
 * Function to avoid a bug with browser caching and keep the image file updated,
 * only applied on images creating a new url for the file each
 */
const url = (raw: RawFileMetadata): string => {
	const downloadUrl = `/api/files/${raw.GUID}`;
	if (isImage(raw)) {
		const updateTimestamp = new Date(raw.Updated);
		return `${downloadUrl}?${updateTimestamp.getTime()}`;
	}
	return downloadUrl;
};

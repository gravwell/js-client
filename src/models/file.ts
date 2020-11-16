/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, RawNumericID, RawUUID, toNumericID, UUID } from '../value-objects';

export interface FileMetadata {
	id: UUID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;
	isGlobal: boolean;

	name: string;
	description: string | null;
	labels: Array<string>;

	lastUpdateDate: Date;

	/**
	 * Root URL to download the resource from the current host.
	 */
	downloadURL: string;
	size: number;
	contentType: string;
}

export interface RawBaseFileMetadata {
	GUID: RawUUID;

	Name: string;
	Desc: string; // empty string or "undefined" is null

	Size: number;
	Type: string; // Content type eg. "image/png"
}

export interface RawFileMetadata {
	GUID: RawUUID;
	ThingUUID: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;
	Global: boolean | null;

	Name: string;
	Desc: string; // empty string or "undefined" is null
	Labels: Array<string> | null;

	Updated: string; // Timestamp

	Size: number;
	Type: string; // Content type eg. "image/png"
}

export const toFileMetadata = (raw: RawFileMetadata): FileMetadata => ({
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

export const isFileMetadata = (value: any): value is FileMetadata => {
	try {
		const f = <FileMetadata>value;
		return !!f;
	} catch {
		return false;
	}
};

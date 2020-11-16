/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isInteger, isString } from 'lodash';
import { isNumericID, isUUID, NumericID, RawNumericID, RawUUID, UUID } from '../value-objects';

export interface Resource {
	/**
	 * Unique identifier for the resource.
	 */
	id: UUID;

	/**
	 *  User ID of the resource owner.
	 */
	userID: NumericID;

	/**
	 * A list of group IDs which are allowed to access this resource.
	 */
	groupIDs: Array<NumericID>;

	/**
	 * User-friendly name of the resource.
	 */
	name: string;

	/**
	 * Description of the resource.
	 */
	description: string;

	/**
	 * An array of strings containing optional labels to apply to the resource.
	 */
	labels: Array<string>;

	/**
	 * Root URL to download the resource from the current host.
	 */
	downloadURL: string;

	/**
	 * Boolean flag. If set, all users on the system may view the resource.
	 */
	isGlobal: boolean;

	/**
	 * Date indicating when the resource was last modified.
	 */
	lastUpdateDate: Date;

	/**
	 * Integer incremented every time the resource contents are changed.
	 */
	version: number;

	/**
	 * Size, in bytes, of the resource contents.
	 */
	size: number;

	/**
	 *  SHA1 hash of the resource contents.
	 */
	hash: string;
}

export interface RawResource {
	GUID: RawUUID;

	UID: RawNumericID;
	GroupACL: Array<RawNumericID> | null;
	Labels: Array<string> | null;

	ResourceName: string;
	Description: string;

	Domain: number;
	VersionNumber: number;
	Size: number;
	Hash: string;

	Global: boolean;
	Synced: boolean;

	LastModified: string; // Timestamp
}

export const toResource = (raw: RawResource): Resource => ({
	id: raw.GUID,
	downloadURL: `/api/resources/${raw.GUID}/raw`,

	userID: raw.UID.toString(),
	groupIDs: raw.GroupACL?.map(id => id.toString()) ?? [],

	name: raw.ResourceName,
	description: raw.Description.trim(),
	labels: raw.Labels ?? [],

	isGlobal: raw.Global,
	lastUpdateDate: new Date(raw.LastModified),

	version: raw.VersionNumber,
	hash: raw.Hash,
	size: raw.Size,
});

export const isResource = (value: any): value is Resource => {
	try {
		const r = <Resource>value;
		return (
			isUUID(r.id) &&
			isNumericID(r.userID) &&
			r.groupIDs.every(isNumericID) &&
			isString(r.name) &&
			isString(r.description) &&
			r.labels.every(isString) &&
			isBoolean(r.isGlobal) &&
			isDate(r.lastUpdateDate) &&
			isInteger(r.version) &&
			isString(r.hash) &&
			isInteger(r.size)
		);
	} catch {
		return false;
	}
};

export const isBlankRawResource = (value: RawResource): boolean => value.GUID === '';

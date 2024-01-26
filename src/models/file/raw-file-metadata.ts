/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects/id';

export interface RawBaseFileMetadata {
	ThingUUID: string;
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

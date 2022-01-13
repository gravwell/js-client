/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '~/value-objects';

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

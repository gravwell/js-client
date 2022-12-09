/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects';

export interface RawPlaybook {
	UUID: RawUUID;
	GUID: RawUUID;
	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;
	Global: boolean;
	Name: string; // Empty string is null
	Desc: string; // Empty string is null

	/**
	 * A playbook can be created without body. In this case, the Body property
	 * will not be present.
	 *
	 * Base64 encoded markdown string, it comes as an empty string when requesting
	 * multiple playbooks.
	 */
	Body?: string | null | undefined;
	Metadata: string; // Base64 encoded RawPlaybookDecodedMetadata
	Labels: Array<string> | null;
	LastUpdated: string; // Timestamp
	Author: {
		Name: string; // Empty string "" is null
		Email: string; // Empty string "" is null
		Company: string; // Empty string "" is null
		URL: string; // Empty string "" is null
	};
}

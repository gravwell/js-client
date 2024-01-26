/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects/id';

// Named as AXDefinition in the Go source
export interface RawAutoExtractor {
	UUID: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;

	Name: string;
	Desc?: string | undefined;
	Labels: Array<string> | null;

	Global: boolean;
	LastUpdated: string; // Timestamp

	Tag: string;
	Module: string;
	Params: string;
	Args?: string | undefined;
}

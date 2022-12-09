/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects';
import { RawTimeframe } from '../timeframe';

export interface RawSavedQuery {
	ThingUUID: RawUUID;
	GUID: RawUUID;

	UID: RawNumericID;
	GIDs?: Array<RawNumericID> | null;
	Global: boolean;

	Name: string;
	Description: string; // Empty is null
	Labels?: Array<string> | null;

	Query: string;
	Metadata?: { timeframe?: RawTimeframe | null } | null;
}

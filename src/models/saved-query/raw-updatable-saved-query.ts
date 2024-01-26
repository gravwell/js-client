/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects/id';
import { RawTimeframe } from '../timeframe/raw-timeframe';

export interface RawUpdatableSavedQuery {
	ThingUUID: RawUUID; // gravwell/gravwell#2524
	UID: RawNumericID;
	GUID?: RawUUID;

	GIDs: Array<RawNumericID>;
	Global: boolean;

	Name: string;
	Description: string; // Empty is null
	Labels: Array<string>;

	Query: string;
	Metadata: { timeframe: RawTimeframe | null };
}

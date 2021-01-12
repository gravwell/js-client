/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID, RawUUID } from '../../value-objects';
import { RawTimeframe } from '../timeframe';

export interface RawUpdatableSavedQuery {
	ThingUUID: RawUUID; // gravwell/gravwell#2524
	GUID?: RawUUID;

	GIDs: Array<RawNumericID>;
	Global: boolean;

	Name: string;
	Description: string; // Empty is null
	Labels: Array<string>;

	Query: string;
	Metadata: { timeframe: RawTimeframe | null };
}

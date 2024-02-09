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

export interface RawCreatableSavedQuery {
	GUID?: RawUUID;

	GIDs: Array<RawNumericID>;
	Global: boolean;

	WriteAccess: {
		Global: boolean;
		GIDs?: Array<RawNumericID> | null;
	};

	Name: string;
	Description: string; // Empty is null
	Labels: Array<string>;

	Query: string;
	Metadata: { timeframe: RawTimeframe | null };
}

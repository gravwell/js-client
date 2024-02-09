/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Access } from '~/models/saved-query/access';
import { NumericID, UUID } from '~/value-objects/id';
import { Timeframe } from '../timeframe/timeframe';

export interface SavedQueryData {
	id: UUID;
	globalID: UUID;

	userID: NumericID;

	can: {
		delete: boolean;
		modify: boolean;
		share: boolean;
	};

	access: Access;

	name: string;
	description: string | null;
	labels: Array<string>;

	query: string;
	defaultTimeframe: Timeframe | null;
}

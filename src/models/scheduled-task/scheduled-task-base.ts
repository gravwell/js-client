/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID, UUID } from '~/value-objects';

export interface ScheduledTaskBase {
	id: NumericID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;
	isGlobal: boolean;

	name: string;
	description: string;
	labels: Array<string>;

	oneShot: boolean;
	isDisabled: boolean;

	lastUpdateDate: Date;
	lastRun: null | {
		date: Date;
		duration: number;
	};

	lastSearchIDs: null | Array<NumericID>;
	lastError: string | null;

	schedule: string;
	timezone: string | null;
}

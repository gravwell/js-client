/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects';

export interface BroadcastedNotification {
	id: NumericID;
	customID: NumericID | null;
	type: 'broadcasted';
	message: string;
	userID: NumericID;

	sentDate: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	expirationDate: string; // Timestamp eg. '2019-04-23T03:44:01.776918756Z'
	ignoreUntilDate: string; // Timestamp eg. '0001-01-01T00:00:00Z'

	origin: string;
	senderID: NumericID;
	level: BroadcastedLevel;
	link: string | null;
}

export type BroadcastedLevel = 'info' | 'warn' | 'error' | 'critical' | 'high' | null;

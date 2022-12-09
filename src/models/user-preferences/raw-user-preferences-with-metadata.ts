/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '~/value-objects';

export interface RawUserPreferencesWithMetadata {
	Name: 'prefs';

	/** Base 64 encoded user preferences */
	Data: string;

	Synced: boolean;

	/** User ID of the owner of those preferences */
	UID: RawNumericID;

	/** Timestamp of the last update */
	Updated: string;
}

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID } from '~/value-objects';
import { RawUUID } from '../../value-objects/id';

export interface RawUpdatableFile {
	GUID?: RawUUID;

	UID: RawNumericID;
	GIDs: Array<RawNumericID>;
	Global: boolean;

	Name: string;
	Desc: string; // Use empty string for null
	Labels: Array<string>;
}

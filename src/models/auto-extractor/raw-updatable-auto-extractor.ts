/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawNumericID, RawUUID } from '~/value-objects/id';

export interface RawUpdatableAutoExtractor {
	UUID: RawUUID;
	GIDs: Array<RawNumericID>;
	UID: RawNumericID;

	Name: string;
	Desc: string;
	Labels: Array<string>;

	Global: boolean;

	Tag: string;
	Module: string;
	Params: string;
	Args: string; // Empty string is null
}

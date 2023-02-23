/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects';

export interface UpdatableGroup {
	id: NumericID;
	name?: string;
	description?: string | null;
	isSynced?: boolean;
}

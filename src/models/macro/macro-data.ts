/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';

export interface MacroData {
	id: NumericID;
	userID: NumericID;
	groupIDs: Array<NumericID>;

	/**
	 * All uppercase and no spaces.
	 */
	name: string;
	description: string | null;
	labels: Array<string>;

	expansion: string;
	lastUpdateDate: Date;
}

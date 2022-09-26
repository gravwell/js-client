/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';

export interface UpdatableMacro {
	id: NumericID;
	groupIDs?: Array<NumericID>;
	isGlobal?: boolean;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	expansion?: string;
}

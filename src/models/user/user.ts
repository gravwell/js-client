/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';

export interface User {
	id: NumericID;
	groupIDs: Array<NumericID>;

	username: string;
	name: string;
	email: string;
	role: 'admin' | 'analyst';
	locked: boolean;
	lastActivityDate: Date | null;
	searchGroupID: string | null;
}

export type UserRole = User['role'];

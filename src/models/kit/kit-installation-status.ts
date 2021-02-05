/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID, NumericID, Percentage } from '~/value-objects';

export interface KitInstallationStatus {
	id: NumericID;
	userID: ID;

	percentage: Percentage;
	isDone: boolean;

	logs: Array<string>;
	error: string | null;

	lastUpdateDate: Date;
}

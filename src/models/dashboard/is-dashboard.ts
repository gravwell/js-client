/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNumericID } from '~/value-objects';
import { Dashboard } from './dashboard';

export const isDashboard = (value: any): value is Dashboard => {
	try {
		// TODO
		const d = <Dashboard>value;
		return isNumericID(d.id);
	} catch {
		return false;
	}
};

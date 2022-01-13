/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isInteger } from 'lodash';
import { Version } from './version';

export const isVersion = (value: any): value is Version => {
	try {
		const v = <Version>value;
		return isInteger(v.major) && isInteger(v.minor) && isInteger(v.patch);
	} catch {
		return false;
	}
};

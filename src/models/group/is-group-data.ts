/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, isString } from 'lodash';
import { isNumericID } from '~/value-objects';
import { GroupData } from './group-data';

export const isGroupData = (value: unknown): value is GroupData => {
	try {
		const g = <GroupData>value;
		return isNumericID(g.id) && isString(g.name) && (isString(g.description) || isNull(g.description));
	} catch {
		return false;
	}
};

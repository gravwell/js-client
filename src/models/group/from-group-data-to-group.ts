/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { Group } from './group';
import { GroupData } from './group-data';

export const fromGroupDataToGroup = (data: GroupData): Group => ({
	...data,
	_tag: DATA_TYPE.GROUP,
});

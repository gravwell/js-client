/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { Resource } from './resource';
import { ResourceData } from './resource-data';

export const fromResourceDataToResource = (data: ResourceData): Resource => ({
	...data,
	_tag: DATA_TYPE.RESOURCE,
});

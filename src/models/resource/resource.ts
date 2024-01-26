/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models/data-type';
import { ResourceData } from './resource-data';

export interface Resource extends ResourceData {
	_tag: DATA_TYPE.RESOURCE;
}

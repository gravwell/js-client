/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ElementFilterOperation } from './element-filter-operation';

export interface ElementFilter {
	tag: string;
	module: string;

	path: string;
	operation: ElementFilterOperation;
	value: string;
}

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ElementFilter } from './element-filter';
import { RawElementFilter } from './raw-element-filter';

export const toElementFilter = (raw: RawElementFilter): ElementFilter => ({
	tag: raw.Tag,
	module: raw.Module,
	path: raw.Path,
	arguments: raw.Args ?? null,
	operation: raw.Op,
	value: raw.Value,
});

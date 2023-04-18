/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ElementFilter, ExtractionFilter, OperationFilter } from './element-filter';
import { isRawOperationFilter, RawElementFilter } from './raw-element-filter';

export const toElementFilter = (raw: RawElementFilter): ElementFilter => {
	if (isRawOperationFilter(raw)) {
		const opFilter: OperationFilter = {
			tag: raw.Tag ?? null,
			module: raw.Module,
			path: raw.Path,
			arguments: raw.Args ?? null,
			operation: raw.Op,
			value: raw.Value,
		};
		return opFilter;
	}
	const exFilter: ExtractionFilter = {
		tag: raw.Tag ?? null,
		module: raw.Module,
		path: raw.Path,
		arguments: raw.Args ?? null,
	};
	return exFilter;
};

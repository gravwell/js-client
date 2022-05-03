/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { AutoExtractor } from './auto-extractor';

export const isAutoExtractor = (value: any): value is AutoExtractor => {
	try {
		const ae = <AutoExtractor>value;
		return !!ae;
	} catch {
		return false;
	}
};

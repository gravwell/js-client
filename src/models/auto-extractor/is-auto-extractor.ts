/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { AutoExtractor } from './auto-extractor';
import { isAutoExtractorData } from './is-auto-extractor-data';

export const isAutoExtractor = (value: unknown): value is AutoExtractor => {
	try {
		const ae = <AutoExtractor>value;
		return ae._tag === DATA_TYPE.AUTO_EXTRACTOR && isAutoExtractorData(ae);
	} catch {
		return false;
	}
};

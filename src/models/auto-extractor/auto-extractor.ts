/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models';
import { AutoExtractorData } from './auto-extractor-data';

export interface AutoExtractor extends AutoExtractorData {
	_tag: DATA_TYPE.AUTO_EXTRACTOR;
}

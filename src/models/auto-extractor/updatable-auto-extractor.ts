/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '~/value-objects';
import { AutoExtractorModule } from './auto-extractor';

export interface UpdatableAutoExtractor {
	id: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string;
	labels?: Array<string>;

	isGlobal?: boolean;

	tag?: string;
	module?: AutoExtractorModule;
	parameters?: string;
	arguments?: string | null;
}

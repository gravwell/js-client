/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { File } from '~/functions/utils';
import { NumericID } from '~/value-objects';

export interface UploadableAutoExtractor {
	file: File;

	groupIDs?: Array<NumericID>;
	labels?: Array<string>;
	isGlobal?: boolean;
}

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { File } from '~/functions/utils';
import { NumericID, UUID } from '~/value-objects';

export interface CreatableFile {
	globalID?: UUID;

	groupIDs?: Array<NumericID>;
	userID?: NumericID | undefined;
	isGlobal?: boolean;

	name: string;
	description?: string | null;
	labels?: Array<string>;

	file: File;
}

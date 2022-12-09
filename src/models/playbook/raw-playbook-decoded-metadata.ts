/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawUUID } from '~/value-objects';

export interface RawPlaybookDecodedMetadata {
	dashboards: [];
	attachments?: Array<{
		fileGUID: RawUUID;
		context: 'cover' | 'banner';
		type: 'image';
	}>;
}

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawNumericID } from '~/value-objects';

export interface RawCreatablePlaybook {
	Name: string;
	Desc: string | null;
	Body: string; // Base64 encoded markdown string
	Metadata: string; // Base64 encoded RawPlaybookDecodedMetadata

	// !WARNING: That's not working right now, CHECK
	UID?: RawNumericID;
	GIDs: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;

	Author: {
		Name: string; // Empty string "" is null
		Email: string; // Empty string "" is null
		Company: string; // Empty string "" is null
		URL: string; // Empty string "" is null
	};
}

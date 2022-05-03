/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Markdown, NumericID, UUID } from '~/value-objects';

export interface UpdatablePlaybook {
	id: UUID;

	userID?: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string | null;
	description?: string | null;
	labels?: Array<string>;

	isGlobal?: boolean;

	body?: Markdown;
	coverImageFileGUID?: UUID | null;
}

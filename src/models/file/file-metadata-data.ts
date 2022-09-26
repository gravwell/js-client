/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';

export interface FileMetadataData {
	id: UUID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;
	isGlobal: boolean;

	name: string;
	description: string | null;
	labels: Array<string>;

	lastUpdateDate: Date;

	/**
	 * Root URL to download the resource from the current host.
	 */
	downloadURL: string;
	size: number;
	contentType: string;
}

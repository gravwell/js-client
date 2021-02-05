/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { Version } from '../version';
import { KitItem } from './kit-item';

export interface LocalKit {
	customID: UUID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	name: string;
	description: string;
	labels: Array<string>;

	installationDate: Date;

	version: Version;
	gravwellCompatibility: {
		min: Version;
		max: Version;
	};

	status: 'installed' | 'uploaded';
	isSigned: boolean;
	requiresAdminPrivilege: boolean;

	items: Array<KitItem>;
	settings: Array<{
		type: 'macro value';
		name: string;
		description: string;
		defaultValue: string;
		value: string | null;
		valueType: 'tag' | 'string';
	}>;
}

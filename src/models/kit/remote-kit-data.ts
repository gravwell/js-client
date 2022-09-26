/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '~/value-objects';
import { Version } from '../version';
import { KitAsset } from './kit-asset';
import { KitDependency } from './kit-dependency';
import { KitItem } from './kit-item';

export interface RemoteKitData {
	customID: UUID;
	globalID: UUID;

	name: string;
	description: string;
	labels: Array<string>;

	creationDate: Date;

	version: Version;
	gravwellCompatibility: {
		min: Version;
		max: Version;
	};

	size: number;
	ingesters: Array<string>;

	isSigned: boolean;
	requiresAdminPrivilege: boolean;

	assets: Array<KitAsset>;
	dependencies: Array<KitDependency>;
	items: Array<KitItem>;
}

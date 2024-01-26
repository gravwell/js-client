/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Version } from '~/models/version/version';
import { NumericID, UUID } from '../../value-objects/id';
import { ConfigMacro } from './config-macro';
import { KitAsset } from './kit-asset';
import { KitItem } from './kit-item';

export interface LocalKitData {
	customID: UUID;
	globalID: UUID;

	userID: NumericID;
	groupID: NumericID | null;

	name: string;
	description: string;
	labels: Array<string>;

	/** Metadata */
	readme: string | null;
	bannerID: string | null;
	coverID: string | null;
	iconID: string | null;

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
	modifiedItems: Array<KitItem>;
	conflictingItems: Array<KitItem>;

	configMacros: Array<ConfigMacro>;
	requiredDependencies: Array<LocalKitDependency>; // create a LocalKitDependency interface
}

// TODO: This look very similar to the `RemoteKit` but still missing some properties, so we need to check if this interface can be deleted to use the `KitDependency` that just has the ID and fetch the `RemoteKit` when necessary (may we can create something like `BaseRemoteKit` with the common properties)
/** The Metadata from the Kit that is a dependency of another Kit */
export type LocalKitDependency = {
	customID: string;
	globalID: UUID;

	name: string;
	description: string;
	version: Version;

	gravwellCompatibility: {
		min: Version;
		max: Version;
	};

	createdDate: Date;
	isSigned: boolean;
	requiresAdminPrivilege: boolean;

	size: number;
	tags: Array<string>; // tags associated with the kit
	ingesters: Array<string>;

	assets: Array<KitAsset>;
	items: Array<KitItem>;
};

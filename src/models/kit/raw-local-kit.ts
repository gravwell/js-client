/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawKitAsset } from '~/models/kit/raw-kit-asset';
import { RawVersionObject } from '~/models/version/raw-version-object';
import { RawID, RawNumericID, RawUUID } from '~/value-objects/id';
import { RawConfigMacro } from './raw-config-macro';
import { RawKitItem } from './raw-kit-item';

export interface RawLocalKit {
	ID: RawID; // Neither numeric nor UUID, eg. 'io.gravwell.weather'
	UUID: RawUUID; // GlobalID

	UID: RawNumericID; // UserID
	GID?: RawNumericID; // GroupID, undefined or 0 for null

	Name: string;
	Description: string;
	Labels: Array<string> | null; // Might contain empty labels (''), those should be ignored

	InstallationTime: string; // timestamp

	Version: number;
	MinVersion: RawVersionObject;
	MaxVersion: RawVersionObject;

	Installed: boolean;
	Signed: boolean;
	AdminRequired: boolean;

	Readme: string; //null is an empty string
	Icon: string; // null is an empty string
	Banner: string; // null is an empty string
	Cover: string; // null is an empty string

	ModifiedItems: null | Array<RawKitItem>;
	ConflictingItems: null | Array<RawKitItem>;
	RequiredDependencies: Array<RawLocalKitDependency> | null; // looks be a RawRemoteKit | null

	Items: Array<RawKitItem>;
	ConfigMacros: null | Array<RawConfigMacro>;

	GIDs: Array<RawNumericID> | null;
	Global: boolean | null;
}

export type RawLocalKitDependency = {
	ID: string;
	UUID: RawUUID;

	Name: string;
	Version: number;
	Description: string;
	Signed: boolean;
	AdminRequired: boolean;
	MinVersion: RawVersionObject;
	MaxVersion: RawVersionObject;
	Size: number;
	Created: string;
	Ingesters: Array<string>;
	Tags: Array<string>; // tags associated with the kit
	Assets: Array<RawKitAsset>;
	Items: Array<RawKitItem>;
	GIDs: Array<RawNumericID> | null;
	Global: boolean | null;
};

export class KitError extends Error {
	public ModifiedItems: Array<RawKitItem>;
	constructor(error: { Error: string; ModifiedItems: Array<RawKitItem> }) {
		super(error.Error);
		this.ModifiedItems = error.ModifiedItems;
	}
}

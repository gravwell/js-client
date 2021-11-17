/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawID, RawNumericID, RawUUID } from '~/value-objects';
import { RawVersionObject } from '../version';
import { RawConfigMacro } from './raw-config-macro';
import { RawKitItem } from './raw-kit-item';

export interface RawLocalKit {
	ID: RawID; // Neither numeric nor UUID, eg. 'io.gravwell.weather'
	UUID: RawUUID;

	UID: RawNumericID;
	GID: RawNumericID;

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

	Icon: '';
	ModifiedItems: null;
	ConflictingItems: null;
	RequiredDependencies: null;

	Items: Array<RawKitItem>;
	ConfigMacros: null | Array<RawConfigMacro>;
}

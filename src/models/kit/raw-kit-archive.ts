/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawVersionObject } from '~/models/version/raw-version-object';
import { RawNumericID, RawUUID } from '~/value-objects/id';
import { RawConfigMacro } from './raw-config-macro';
import { RawKitEmbeddedItem } from './raw-kit-embedded-item';

export interface RawKitArchive {
	ID: RawNumericID;
	UID: RawNumericID;
	Name: string;
	Description: string;
	Version: number;
	MinVersion: RawVersionObject;
	MaxVersion: RawVersionObject;
	Readme: string;
	ScriptDeployRules: Record<string, RawDeployRules>;
	BuildDate: string;
	// Image files
	Cover: RawUUID;
	Icon: RawUUID;
	Banner: RawUUID;
	// Embedded Items (licenses)
	EmbeddedItems: Array<RawKitEmbeddedItem>;
	// Contents
	ConfigMacros?: Array<RawConfigMacro>;
	Pivots?: Array<RawUUID>;
	Dashboards?: Array<RawNumericID>;
	Extractors?: Array<RawUUID>;
	Files?: Array<RawUUID>;
	Macros?: Array<RawNumericID>;
	Playbooks?: Array<RawUUID>;
	Resources?: Array<RawUUID>;
	SearchLibraries?: Array<RawUUID>;
	ScheduledSearches?: Array<RawNumericID>;
	Templates?: Array<RawUUID>;
	Flows?: Array<RawUUID>;
	Alerts?: Array<RawUUID>;
}

export interface RawDeployRules {
	Disabled: boolean;
	RunImmediately: boolean;
}

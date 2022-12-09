/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawID, RawNumericID, RawUUID } from '~/value-objects';
import { RawVersionObject } from '../version';
import { RawConfigMacro } from './raw-config-macro';
import { RawKitEmbeddedItem } from './raw-kit-embedded-item';

export interface RawBuildableKit {
	ID: RawID;
	Name: string;
	Description: string;
	Version: number;
	MinVersion: RawVersionObject | null;
	MaxVersion: RawVersionObject | null;
	Readme: string;
	Dashboards: Array<RawNumericID>;
	Extractors: Array<RawUUID>;
	Files: Array<RawUUID>;
	Macros: Array<RawNumericID>;
	Pivots: Array<RawUUID>;
	Playbooks: Array<RawUUID>;
	Resources: Array<RawUUID>;
	ScheduledSearches: Array<RawNumericID>;
	SearchLibraries: Array<RawUUID>;
	Templates: Array<RawUUID>;
	EmbeddedItems: Array<RawKitEmbeddedItem>;

	Icon?: string;
	Banner?: string;
	Cover?: string;

	ConfigMacros: Array<RawConfigMacro> | null;
}

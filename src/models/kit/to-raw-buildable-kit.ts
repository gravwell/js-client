/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { encode as base64Encode } from 'base-64';
import { encode as utf8Encode } from 'utf8';
import { toRawNumericID } from '~/value-objects';
import { BuildableKit } from './buildable-kit';
import { RawBuildableKit } from './raw-buildable-kit';

export const toRawBuildableKit = (data: BuildableKit): RawBuildableKit => ({
	ID: data.customID,

	Name: data.name,
	Description: data.description,
	Version: data.version.major,

	Dashboards: data.dashboardIDs.map(toRawNumericID),
	Extractors: data.autoExtractorIDs,
	Files: data.fileIDs,
	Macros: data.macroIDs.map(toRawNumericID),
	Pivots: data.actionableIDs,
	Playbooks: data.playbookIDs,
	Resources: data.resourceIDs,
	ScheduledSearches: data.scheduledQueryIDs.concat(data.scheduledScriptIDs).map(toRawNumericID),
	Templates: data.templateIDs,
	SearchLibraries: data.savedQueryIDs,
	EmbeddedItems: data.licenses.map(l => ({
		Type: 'license',
		Name: l.name,
		Content: base64Encode(utf8Encode(l.content)),
	})),

	Icon: data.icon,
	ConfigMacros: data.settings.map(s => ({
		DefaultValue: s.defaultValue,
		Description: s.description,
		MacroName: s.name,
		Value: s.value,
	})),
});

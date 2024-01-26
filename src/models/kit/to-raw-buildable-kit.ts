/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { encode as base64Encode } from 'base-64';
import { encode as utf8Encode } from 'utf8';
import { toRawNumericID } from '~/value-objects/id';
import { omitUndefinedShallow } from '../../functions/utils/omit-undefined-shallow';
import { toRawVersionObject } from './../version/to-raw-version-object';
import { BuildableKit } from './buildable-kit';
import { RawBuildableKit } from './raw-buildable-kit';
import { toRawConfigMacro } from './to-raw-config-macro';

export const toRawBuildableKit = (data: BuildableKit): RawBuildableKit =>
	omitUndefinedShallow({
		ID: data.customID,
		Name: data.name,
		Description: data.description,
		Version: data.version,
		MinVersion: data.minVersion ? toRawVersionObject(data.minVersion) : null,
		MaxVersion: data.maxVersion ? toRawVersionObject(data.maxVersion) : null,
		Readme: data.readme,
		Alerts: data.alertIDs,
		Dashboards: data.dashboardIDs.map(toRawNumericID),
		Extractors: data.autoExtractorIDs,
		Files: data.fileIDs,
		Flows: data.flowIDs,
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
		Cover: data.cover,
		Banner: data.banner,

		ConfigMacros: data.configMacros.map(toRawConfigMacro),
	});

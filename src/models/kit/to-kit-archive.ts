/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { ID, NumericID, RawNumericID, RawUUID, toNumericID, UUID } from '~/value-objects';
import { isScheduledQuery, isScheduledScript, ScheduledTask } from '../scheduled-task';
import { toVersion } from './../version';
import { DeployRules, KitArchive } from './kit-archive';
import { RawDeployRules, RawKitArchive } from './raw-kit-archive';
import { toConfigMacros } from './to-config-macro';

export const toKitArchive = (raw: RawKitArchive, scheduledTasks: Array<ScheduledTask>): KitArchive => {
	const scriptDeployRules = Object.entries(raw.ScriptDeployRules ?? {}).reduce((acc, cur) => {
		acc[cur[0]] = toDeployRules(cur[1]);
		return acc;
	}, {} as Record<string, DeployRules>);

	// previous builds may not have a date so we make it null if it starts with 0001
	const buildDate = raw.BuildDate.indexOf('0001') === 0 ? null : new Date(raw.BuildDate);

	// The scheduled scripts and scheduled searches come from the API call.
	// So we need to retrieve all the scripts and scheduled searches to then see which one is what.
	const scheduledTaskIDs = new Set((raw.ScheduledSearches ?? []).map(toNumericID));
	const scheduledScriptIDs: Array<ID> = scheduledTasks
		.filter(isScheduledScript)
		.filter(script => scheduledTaskIDs.has(script.id))
		.map(script => script.id);
	const scheduledSearchIDs: Array<ID> = scheduledTasks
		.filter(isScheduledQuery)
		.filter(search => scheduledTaskIDs.has(search.id))
		.map(search => search.id);

	const embeddedItems = (raw.EmbeddedItems ?? []).map(item => ({
		name: item.Name,
		content: item.Content,
		type: item.Type,
	}));

	const rawConfigMacros = raw.ConfigMacros ?? [];
	const configMacros = toConfigMacros(rawConfigMacros);

	return {
		_tag: DATA_TYPE.KIT_ARCHIVE,
		id: raw.ID.toString(),
		userID: raw.UID.toString(),
		buildDate,
		name: raw.Name,
		description: raw.Description,
		version: raw.Version,
		minVersion: toVersion(raw.MinVersion),
		maxVersion: toVersion(raw.MaxVersion),
		readme: raw.Readme,
		scriptDeployRules,
		// image files
		cover: raw.Cover,
		icon: raw.Icon,
		banner: raw.Banner,
		// embedded items
		embeddedItems,
		// contents
		actionables: toStringArray(raw.Pivots ?? []),
		configMacros,
		dashboards: raw.Dashboards ?? [],
		extractors: toStringArray(raw.Extractors ?? []),
		files: toStringArray(raw.Files ?? []),
		macros: raw.Macros ?? [],
		playbooks: toStringArray(raw.Playbooks ?? []),
		resources: toStringArray(raw.Resources ?? []),
		savedQueries: toStringArray(raw.SearchLibraries ?? []),
		scheduledSearches: scheduledSearchIDs,
		scripts: scheduledScriptIDs,
		templates: toStringArray(raw.Templates ?? []),
	};
};

export const toDeployRules = (raw: RawDeployRules): DeployRules => {
	return {
		disabled: raw.Disabled,
		runImmediately: raw.RunImmediately,
	};
};

const toStringArray = (raw: Array<RawUUID | RawNumericID>): Array<UUID | NumericID> => {
	return raw ? raw.map(i => i.toString()) : [];
};

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, RawNumericID, RawUUID, UUID } from '~/value-objects';
import { isScheduledQuery, isScheduledScript } from './../scheduled-task';
import { toVersion } from './../version';
import { DeployRules, KitArchive } from './kit-archive';
import { RawDeployRules, RawKitArchive } from './raw-kit-archive';
import { toConfigMacros } from './to-config-macro';

export const toKitArchive = (raw: RawKitArchive): KitArchive => {
	const scriptDeployRules = Object.entries(raw.ScriptDeployRules ?? {}).reduce((acc, cur) => {
		acc[cur[0]] = toDeployRules(cur[1]);
		return acc;
	}, {} as Record<string, DeployRules>);

	// previous builds may not have a date so we make it null if it starts with 0001
	const buildDate = raw.BuildDate.indexOf('0001') === 0 ? null : new Date(raw.BuildDate);

	const scheduled = raw.ScheduledSearches ?? [];
	const scripts = scheduled.filter(isScheduledScript);
	const scheduledSearches = scheduled.filter(isScheduledQuery);

	const embeddedItems = (raw.EmbeddedItems ?? []).map(item => ({
		name: item.Name,
		content: item.Content,
		type: item.Type,
	}));

	const rawConfigMacros = raw.ConfigMacros ?? [];
	const configMacros = toConfigMacros(rawConfigMacros);

	return {
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
		scheduledSearches: toStringArray(scheduledSearches),
		scripts: toStringArray(scripts),
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

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isEmpty } from 'lodash';
import { toNumericID } from '../../value-objects';
import { DATA_TYPE } from '../data-type';
import { toVersion } from '../version';
import { KitItem } from './kit-item';
import { LocalKit } from './local-kit';
import { LocalKitDependency } from './local-kit-data';
import { RawLocalKit, RawLocalKitDependency } from './raw-local-kit';
import { toConfigMacros } from './to-config-macro';
import { toKitAsset } from './to-kit-asset';
import { toKitItem } from './to-kit-item';

export const toLocalKit = (raw: RawLocalKit): LocalKit => ({
	_tag: DATA_TYPE.LOCAL_KIT,
	customID: raw.ID,
	globalID: raw.UUID,

	userID: toNumericID(raw.UID),
	groupID: raw.GID && raw.GID > 0 ? toNumericID(raw.GID) : null,

	readme: isEmpty(raw.Readme) ? null : raw.Readme,
	bannerID: isEmpty(raw.Banner) ? null : raw.Banner,
	coverID: isEmpty(raw.Cover) ? null : raw.Cover,
	iconID: isEmpty(raw.Icon) ? null : raw.Icon,

	name: raw.Name,
	description: raw.Description,
	labels: (raw.Labels ?? []).map(v => v.trim()).filter(v => v !== ''),

	installationDate: new Date(raw.InstallationTime),

	version: toVersion(raw.Version),
	gravwellCompatibility: {
		min: toVersion(raw.MinVersion),
		max: toVersion(raw.MaxVersion),
	},

	status: raw.Installed ? 'installed' : 'uploaded',
	isSigned: raw.Signed,
	requiresAdminPrivilege: raw.AdminRequired,

	items: raw.Items.map<KitItem>(toKitItem),
	conflictingItems: (raw.ConflictingItems ?? []).map(toKitItem),
	modifiedItems: (raw.ModifiedItems ?? []).map(toKitItem),

	requiredDependencies: (raw.RequiredDependencies ?? []).map(toLocalKitDependency),
	configMacros: toConfigMacros(raw.ConfigMacros ?? []),
});

export const toLocalKitDependency = (raw: RawLocalKitDependency): LocalKitDependency => ({
	customID: raw.ID,
	globalID: raw.UUID,

	name: raw.Name,
	description: raw.Description,
	version: toVersion(raw.Version),

	gravwellCompatibility: {
		min: toVersion(raw.MinVersion),
		max: toVersion(raw.MaxVersion),
	},

	createdDate: new Date(raw.Created),
	isSigned: raw.Signed ?? false,
	requiresAdminPrivilege: raw.AdminRequired ?? false,

	size: raw.Size,
	tags: raw.Tags ?? [],
	ingesters: raw.Ingesters ?? [],

	items: (raw.Items ?? []).map(toKitItem),
	assets: (raw.Assets ?? []).map(asset => toKitAsset(asset, raw.UUID)),
});

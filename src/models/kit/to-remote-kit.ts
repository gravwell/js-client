/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models';
import { toConfigMacro } from '~/models/kit/to-config-macro';
import { toRawConfigMacro } from '~/models/kit/to-raw-config-macro';
import { toRawVersionObject, toVersion } from '../version';
import { KitAsset } from './kit-asset';
import { RawRemoteKit } from './raw-remote-kit';
import { RemoteKit } from './remote-kit';
import { toKitAsset, toRawKitAsset } from './to-kit-asset';
import { toKitItem } from './to-kit-item';
import { toRawKitItem } from './to-raw-kit-item';

export const toRemoteKit = (raw: RawRemoteKit): RemoteKit => ({
	_tag: DATA_TYPE.REMOTE_KIT,
	customID: raw.ID,
	globalID: raw.UUID,

	name: raw.Name,
	description: raw.Description,
	labels: (raw.Tags ?? []).map(v => v.trim()).filter(v => v !== ''),

	creationDate: new Date(raw.Created),

	version: toVersion(raw.Version),
	gravwellCompatibility: {
		min: toVersion(raw.MinVersion),
		max: toVersion(raw.MaxVersion),
	},

	size: raw.Size,
	ingesters: (raw.Ingesters ?? []).map(v => v.trim()).filter(v => v !== ''),

	isSigned: raw.Signed,
	requiresAdminPrivilege: raw.AdminRequired,

	assets: raw.Assets.map<KitAsset>(rawAsset => toKitAsset(rawAsset, raw.UUID)),

	dependencies: (raw.Dependencies ?? []).map(dep => ({
		id: dep.ID,
		compatibility: { min: toVersion(dep.MinVersion) },
	})),

	items: raw.Items.map(toKitItem),
	configMacros: (raw.ConfigMacros ?? []).map(toConfigMacro),
});

export const toRawRemoteKit = (remoteKit: RemoteKit): RawRemoteKit => ({
	ID: remoteKit.customID,
	UUID: remoteKit.globalID,

	Name: remoteKit.name,
	Description: remoteKit.name,
	Tags: remoteKit.labels ?? [],

	Created: remoteKit.creationDate.toISOString(),

	Version: remoteKit.version.major,
	MinVersion: toRawVersionObject(remoteKit.gravwellCompatibility.min),
	MaxVersion: toRawVersionObject(remoteKit.gravwellCompatibility.max),

	Size: remoteKit.size,
	Ingesters: remoteKit.ingesters ?? [],

	Signed: remoteKit.isSigned,
	AdminRequired: remoteKit.requiresAdminPrivilege,

	Assets: remoteKit.assets.map(toRawKitAsset),

	Dependencies: remoteKit.dependencies.map(dep => ({
		ID: dep.id,
		MinVersion: dep.compatibility.min.major,
	})),
	Items: remoteKit.items.map(toRawKitItem),

	ConfigMacros: remoteKit.configMacros.map(toRawConfigMacro),
});

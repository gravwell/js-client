/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toNumericID } from '~/value-objects';
import { toVersion } from '../version';
import { KitItem } from './kit-item';
import { LocalKit } from './local-kit';
import { RawLocalKit } from './raw-local-kit';
import { toKitItem } from './to-kit-item';

export const toLocalKit = (raw: RawLocalKit): LocalKit => ({
	customID: raw.ID,
	globalID: raw.UUID,

	userID: toNumericID(raw.UID),
	groupIDs: [toNumericID(raw.GID)],

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
	settings: (raw.ConfigMacros ?? []).map(s => ({
		type: 'macro value',
		name: s.MacroName,
		description: s.Description,
		defaultValue: s.DefaultValue,
		value: s.Value.trim() === '' ? null : s.Value,
		valueType: s.Type === 'TAG' ? 'tag' : 'string',
	})),
});

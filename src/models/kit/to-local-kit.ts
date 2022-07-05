/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { toNumericID } from '~/value-objects';
import { toVersion } from '../version';
import { KitItem } from './kit-item';
import { LocalKit } from './local-kit';
import { RawLocalKit } from './raw-local-kit';
import { toConfigMacros } from './to-config-macro';
import { toKitItem } from './to-kit-item';

export const toLocalKit = (raw: RawLocalKit): LocalKit => ({
	_tag: DATA_TYPE.LOCAL_KIT,
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
	configMacros: toConfigMacros(raw.ConfigMacros ?? []),
});

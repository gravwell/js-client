/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { toVersion } from '../version';
import { KitAsset } from './kit-asset';
import { RawRemoteKit } from './raw-remote-kit';
import { RemoteKit } from './remote-kit';
import { toKitItem } from './to-kit-item';

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

	assets: raw.Assets.map<KitAsset>(a => {
		switch (a.Type) {
			case 'readme':
				return {
					type: 'readme',
					url: `/api/kits/remote/${raw.UUID}/${a.Source}`,
					isFeatured: a.Featured,
				};
			case 'image':
				return {
					type: 'image',
					description: a.Legend,
					url: `/api/kits/remote/${raw.UUID}/${a.Source}`,
					isFeatured: a.Featured,
				};
		}
	}),

	dependencies: (raw.Dependencies ?? []).map(dep => ({
		id: dep.ID,
		compatibility: { min: toVersion(dep.MinVersion) },
	})),

	items: raw.Items.map(toKitItem),
});

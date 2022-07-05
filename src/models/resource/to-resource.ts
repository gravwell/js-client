/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { RawResource } from './raw-resource';
import { Resource } from './resource';

export const toResource = (raw: RawResource): Resource => ({
	_tag: DATA_TYPE.RESOURCE,
	id: raw.GUID,
	downloadURL: `/api/resources/${raw.GUID}/raw`,

	userID: raw.UID.toString(),
	groupIDs: raw.GroupACL?.map(id => id.toString()) ?? [],

	name: raw.ResourceName,
	description: raw.Description.trim(),
	labels: raw.Labels ?? [],

	isGlobal: raw.Global,
	lastUpdateDate: new Date(raw.LastModified),

	version: raw.VersionNumber,
	hash: raw.Hash,
	size: raw.Size,
});

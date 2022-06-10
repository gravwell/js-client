/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { encode as base64Encode } from 'base-64';
import { omitUndefinedShallow } from '~/functions/utils';
import { isUUID, toRawNumericID } from '~/value-objects';
import { CreatablePlaybook } from './creatable-playbook';
import { RawCreatablePlaybook } from './raw-creatable-playbook';
import { RawPlaybookDecodedMetadata } from './raw-playbook-decoded-metadata';

export const toRawCreatablePlaybook = (creatable: CreatablePlaybook): RawCreatablePlaybook => {
	const metadata: Required<RawPlaybookDecodedMetadata> = { dashboards: [], attachments: [] };

	// Add cover image to metadata, if it exists
	if (isUUID(creatable.coverImageFileGlobalID))
		metadata.attachments.push({ context: 'cover', type: 'image', fileGUID: creatable.coverImageFileGlobalID });

	// Add banner image to metadata, if it exists
	if (isUUID(creatable.bannerImageFileGlobalID))
		metadata.attachments.push({ context: 'banner', type: 'image', fileGUID: creatable.bannerImageFileGlobalID });

	return omitUndefinedShallow({
		UID: creatable.userID ? toRawNumericID(creatable.userID) : undefined,
		GIDs: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],

		Global: creatable.isGlobal ?? false,
		Labels: creatable.labels ?? [],

		Name: creatable.name ?? '',
		Desc: creatable.description ?? null,

		Body: base64Encode(creatable.body),
		Metadata: base64Encode(JSON.stringify(metadata)),

		Author: {
			Name: creatable.author?.name ?? '',
			Email: creatable.author?.email ?? '',
			Company: creatable.author?.company ?? '',
			URL: creatable.author?.url ?? '',
		},
	});
};

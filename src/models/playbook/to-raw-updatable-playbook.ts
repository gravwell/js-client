/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { encode as base64Encode } from 'base-64';
import { isNull, isUndefined } from 'lodash';
import { omitUndefinedShallow } from '~/functions/utils';
import { isUUID, toRawNumericID } from '~/value-objects';
import { Playbook } from './playbook';
import { RawPlaybookDecodedMetadata } from './raw-playbook-decoded-metadata';
import { RawUpdatablePlaybook } from './raw-updatable-playbook';
import { UpdatablePlaybook } from './updatable-playbook';

export const toRawUpdatablePlaybook = (updatable: UpdatablePlaybook, current: Playbook): RawUpdatablePlaybook => {
	const metadata: Required<RawPlaybookDecodedMetadata> = { dashboards: [], attachments: [] };

	// Add playbook cover to metadata
	((): void => {
		// If the updated playbook has a cover, use it
		if (isUUID(updatable.coverImageFileGlobalID)) {
			metadata.attachments.push({ context: 'cover', type: 'image', fileGUID: updatable.coverImageFileGlobalID });
			return;
		}

		// If the updated playbook cover is `null`, the cover should be removed
		if (isNull(updatable.coverImageFileGlobalID)) {
			return;
		}

		// Otherwise, the updated cover is `undefined`, which means that we should use the current cover
		// If the current playbook has a cover, use it
		if (isUUID(current.coverImageFileGlobalID)) {
			metadata.attachments.push({ context: 'cover', type: 'image', fileGUID: current.coverImageFileGlobalID });
			return;
		}

		// The current playbook cover is `null`, the cover should be removed
		return;
	})();

	// Add playbook banner to metadata
	((): void => {
		// If the updated playbook has a banner, use it
		if (isUUID(updatable.bannerImageFileGlobalID)) {
			metadata.attachments.push({ context: 'banner', type: 'image', fileGUID: updatable.bannerImageFileGlobalID });
			return;
		}

		// If the updated playbook banner is `null`, the banner should be removed
		if (isNull(updatable.bannerImageFileGlobalID)) {
			return;
		}

		// Otherwise, the updated banner is `undefined`, which means that we should use the current banner
		// If the current playbook has a banner, use it
		if (isUUID(current.bannerImageFileGlobalID)) {
			metadata.attachments.push({ context: 'banner', type: 'image', fileGUID: current.bannerImageFileGlobalID });
			return;
		}

		// The current playbook banner is `null`, the banner should be removed
		return;
	})();

	return {
		UID: toRawNumericID(updatable.userID ?? current.userID),
		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

		Global: updatable.isGlobal ?? current.isGlobal,
		Labels: updatable.labels ?? current.labels,

		Name: nullToEmptyString(updatable.name) ?? nullToEmptyString(current.name),
		Desc: isUndefined(updatable.description) ? current.description : updatable.description,

		Body: base64Encode(updatable.body ?? current.body),
		Metadata: base64Encode(JSON.stringify(omitUndefinedShallow(metadata))),

		Author: {
			Name: updatable.author?.name ?? current.author.name ?? '',
			Email: updatable.author?.email ?? current.author.email ?? '',
			Company: updatable.author?.company ?? current.author.company ?? '',
			URL: updatable.author?.url ?? current.author.url ?? '',
		},
	};
};

const nullToEmptyString = <T>(x: T | null): T | string => (isNull(x) ? '' : x);

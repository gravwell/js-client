/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNotNull } from '@lucaspaganini/value-objects/dist/utils';
import { encode as base64Encode } from 'base-64';
import { isNull, isUndefined } from 'lodash';
import { omitUndefinedShallow } from '~/functions/utils';
import { isUUID, toRawNumericID } from '~/value-objects';
import { Playbook } from './playbook';
import { RawPlaybookDecodedMetadata } from './raw-playbook-decoded-metadata';
import { RawUpdatablePlaybook } from './raw-updatable-playbook';
import { UpdatablePlaybook } from './updatable-playbook';

export const toRawUpdatablePlaybook = (updatable: UpdatablePlaybook, current: Playbook): RawUpdatablePlaybook => {
	const metadata: RawPlaybookDecodedMetadata = { dashboards: [], attachments: [] };

	/** If null, then we are deleting and will not add */
	if (isNotNull(updatable.coverImageFileGUID)) {
		// If has a UUID, we add the new cover
		if (isUUID(updatable.coverImageFileGUID))
			metadata.attachments = [{ context: 'cover', type: 'image', fileGUID: updatable.coverImageFileGUID }];
		// If updatable to not have a new one cover, we add the old one
		else if (isUUID(current.coverImageFileGUID))
			metadata.attachments = [{ context: 'cover', type: 'image', fileGUID: current.coverImageFileGUID }];
	}

	/** If null, then we are deleting and will not add */
	if (isNotNull(updatable.bannerImageFileGUID)) {
		// If has a UUID, we add the new cover
		if (isUUID(updatable.bannerImageFileGUID))
			metadata.attachments = [{ context: 'banner', type: 'image', fileGUID: updatable.bannerImageFileGUID }];
		// If updatable to not have a new one cover, we add the old one
		else if (isUUID(current.bannerImageFileGUID))
			metadata.attachments = [{ context: 'banner', type: 'image', fileGUID: current.bannerImageFileGUID }];
	}

	return {
		UID: toRawNumericID(updatable.userID ?? current.userID),
		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

		Global: updatable.isGlobal ?? current.isGlobal,
		Labels: updatable.labels ?? current.labels,

		Name: nullToEmptyString(updatable.name) ?? nullToEmptyString(current.name),
		Desc: isUndefined(updatable.description) ? current.description : updatable.description,

		Body: base64Encode(updatable.body ?? current.body),
		Metadata: base64Encode(JSON.stringify(omitUndefinedShallow(metadata))),
	};
};

const nullToEmptyString = <T>(x: T | null): T | string => (isNull(x) ? '' : x);

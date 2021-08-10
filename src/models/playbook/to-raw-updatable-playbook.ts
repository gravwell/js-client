/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
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
	const metadata: RawPlaybookDecodedMetadata = { dashboards: [] };
	if (isUUID(current.coverImageFileGUID))
		metadata.attachments = [{ context: 'cover', type: 'image', fileGUID: current.coverImageFileGUID }];

	if (isNull(updatable.coverImageFileGUID)) metadata.attachments = undefined;
	else if (isUUID(updatable.coverImageFileGUID))
		metadata.attachments = [{ context: 'cover', type: 'image', fileGUID: updatable.coverImageFileGUID }];

	return {
		UID: toRawNumericID(updatable.userID ?? current.userID),
		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

		Global: updatable.isGlobal ?? current.isGlobal,
		Labels: updatable.labels ?? current.labels,

		Name: updatable.name ?? current.name,
		Desc: isUndefined(updatable.description) ? current.description : updatable.description,

		Body: base64Encode(updatable.body ?? current.body),
		Metadata: base64Encode(JSON.stringify(omitUndefinedShallow(metadata))),
	};
};

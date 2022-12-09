/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isUndefined } from 'lodash';
import { toRawNumericID } from '~/value-objects';
import { FileMetadata } from './file-metadata';
import { RawUpdatableFile } from './raw-updatable-file';
import { UpdatableFile } from './updatable-file';

export const toRawUpdatableFile = (updatable: UpdatableFile, current: FileMetadata): RawUpdatableFile => ({
	GUID: updatable.globalID ?? current.globalID,

	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),
	Global: updatable.isGlobal ?? current.isGlobal,

	Name: updatable.name ?? current.name,
	Desc: (isUndefined(updatable.description) ? current.description : updatable.description) ?? '',
	Labels: updatable.labels ?? current.labels,
});

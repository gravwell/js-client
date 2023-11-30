/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { DATA_TYPE } from '~/models';
import { omitUndefinedShallow } from '../../functions/utils/omit-undefined-shallow';
import { Group } from './group';
import { RawGroup } from './raw-group';

export const toGroup = (raw: RawGroup): Group => {
	const desc = raw.Desc?.trim() ?? '';
	return omitUndefinedShallow({
		_tag: DATA_TYPE.GROUP,
		id: raw.GID.toString(),
		name: raw.Name,
		description: desc === '' ? null : desc,
		isSynced: raw.Synced,
	});
};

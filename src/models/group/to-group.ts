/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Group } from './group';
import { RawGroup } from './raw-group';

export const toGroup = (raw: RawGroup): Group => ({
	id: raw.GID.toString(),
	name: raw.Name,
	description: raw.Desc.trim() === '' ? null : raw.Desc.trim(),
});

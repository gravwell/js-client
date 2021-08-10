/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull } from 'lodash';
import { omitUndefinedShallow } from '~/functions/utils';
import { RawUpdatableGroup } from './raw-updatable-group';
import { UpdatableGroup } from './updatable-group';

export const toRawUpdatableGroup = (data: UpdatableGroup): RawUpdatableGroup =>
	omitUndefinedShallow({
		Name: data.name,
		// TODO: If we send an empty string, it'll be ignored, that's why we need that space
		Desc: isNull(data.description) ? ' ' : data.description,
	});

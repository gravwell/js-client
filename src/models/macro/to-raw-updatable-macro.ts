/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { toRawNumericID } from '~/value-objects';
import { Macro } from './macro';
import { RawUpdatableMacro } from './raw-updatable-macro';
import { UpdatableMacro } from './updatable-macro';

export const toRawUpdatableMacro = (updatable: UpdatableMacro, current: Macro): RawUpdatableMacro => ({
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

	Name: updatable.name ?? current.name,
	Description: (isUndefined(updatable.description) ? current.description : updatable.description) ?? '',
	Labels: updatable.labels ?? current.labels,

	Expansion: updatable.expansion ?? current.expansion,
});

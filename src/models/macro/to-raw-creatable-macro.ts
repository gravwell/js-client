/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRawNumericID } from '~/value-objects';
import { CreatableMacro } from './creatable-macro';
import { RawCreatableMacro } from './raw-creatable-macro';

export const toRawCreatableMacro = (creatable: CreatableMacro): RawCreatableMacro => ({
	GIDs: creatable.groupIDs?.map(toRawNumericID) ?? [],
	Global: creatable.isGlobal ?? false,

	Name: creatable.name.trim(),
	Description: creatable.description?.trim() ?? null,
	Labels: creatable.labels ?? [],

	Expansion: creatable.expansion,
});

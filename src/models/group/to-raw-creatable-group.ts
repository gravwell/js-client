/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableGroup } from './creatable-group';
import { RawCreatableGroup } from './raw-creatable-group';

export const toRawCreatableGroup = (creatable: CreatableGroup): RawCreatableGroup => ({
	Name: creatable.name,
	Desc: creatable.description ?? '',
});

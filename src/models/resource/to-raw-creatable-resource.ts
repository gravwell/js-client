/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRawNumericID } from '~/value-objects';
import { CreatableResource } from './creatable-resource';
import { RawCreatableResource } from './raw-creatable-resource';

export const toRawCreatableResource = (creatable: CreatableResource): RawCreatableResource => ({
	GroupACL: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],

	Global: creatable.isGlobal ?? false,
	Labels: creatable.labels ?? [],

	ResourceName: creatable.name,
	Description: creatable.description,
});

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRawNumericID } from '../../value-objects';
import { RawUpdatableResourceMetadata } from './raw-updatable-resource-metadata';
import { Resource } from './resource';
import { UpdatableResource } from './updatable-resource';

export const toRawUpdatableResourceMetadata = (
	creatable: UpdatableResource,
	current: Resource,
): RawUpdatableResourceMetadata => ({
	GroupACL: (creatable.groupIDs ?? current.groupIDs).map(id => toRawNumericID(id)),

	Global: creatable.isGlobal ?? current.isGlobal,
	Labels: creatable.labels ?? current.labels,

	ResourceName: creatable.name ?? current.name,
	Description: creatable.description ?? current.description,
});

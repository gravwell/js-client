/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { toRawNumericID } from '~/value-objects';
import { CreatableTemplate } from './creatable-template';
import { RawCreatableTemplate } from './raw-creatable-template';

export const toRawCreatableTemplate = (creatable: CreatableTemplate): RawCreatableTemplate =>
	omitUndefinedShallow({
		UID: creatable.userID ? toRawNumericID(creatable.userID) : undefined,
		GIDs: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],
		Global: creatable.isGlobal ?? false,
		Labels: creatable.labels ?? [],
		Name: creatable.name,
		Description: creatable.description ?? null,
		Contents: {
			query: creatable.query,
			variables: creatable.variables,
		},
	});

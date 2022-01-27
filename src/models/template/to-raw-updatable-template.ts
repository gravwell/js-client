/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { toRawNumericID } from '~/value-objects';
import { RawUpdatableTemplate } from './raw-updatable-template';
import { Template } from './template';
import { UpdatableTemplate } from './updatable-template';

export const toRawUpdatableTemplate = (updatable: UpdatableTemplate, current: Template): RawUpdatableTemplate => {
	return {
		UID: toRawNumericID(updatable.userID ?? current.userID),
		GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),
		Global: updatable.isGlobal ?? current.isGlobal,
		Labels: updatable.labels ?? current.labels,
		Name: updatable.name ?? current.name,
		Description: isUndefined(updatable.description) ? current.description : updatable.description,
		Contents: {
			query: updatable.query ?? current.query,
			variables: updatable.variables ?? current.variables,
		},
	};
};

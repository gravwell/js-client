/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { toRawNumericID } from '~/value-objects';
import { AutoExtractor } from './auto-extractor';
import { RawUpdatableAutoExtractor } from './raw-updatable-auto-extractor';
import { UpdatableAutoExtractor } from './updatable-auto-extractor';

export const toRawUpdatableAutoExtractor = (
	updatable: UpdatableAutoExtractor,
	current: AutoExtractor,
): RawUpdatableAutoExtractor => ({
	UUID: current.id,
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),
	UID: Number.parseInt(current.userID),

	Name: updatable.name ?? current.name,
	Desc: updatable.description ?? current.description,
	Labels: updatable.labels ?? current.labels,
	Global: updatable.isGlobal ?? current.isGlobal,

	Tag: updatable.tag ?? current.tag,
	Module: updatable.module ?? current.module,
	Params: updatable.parameters ?? current.parameters,
	Args: (isUndefined(updatable.arguments) ? current.arguments : updatable.arguments) ?? '',
});

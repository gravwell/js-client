/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRawNumericID } from '~/value-objects';
import { CreatableAutoExtractor } from './creatable-auto-extractor';
import { RawCreatableAutoExtractor } from './raw-creatable-auto-extractor';

export const toRawCreatableAutoExtractor = (data: CreatableAutoExtractor): RawCreatableAutoExtractor => ({
	GIDs: (data.groupIDs ?? []).map(toRawNumericID),

	Name: data.name,
	Desc: data.description,
	Labels: data.labels ?? [],

	Global: data.isGlobal ?? false,

	Tag: data.tag,
	Module: data.module,
	Params: data.parameters,
	Args: data.arguments ?? '',
});

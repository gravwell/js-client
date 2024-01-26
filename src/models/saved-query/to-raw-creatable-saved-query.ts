/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil } from 'lodash';
import { omitUndefinedShallow } from '~/functions/utils/omit-undefined-shallow';
import { toRawNumericID } from '~/value-objects/id';
import { toRawTimeframe } from '../timeframe/to-raw-timeframe';
import { CreatableSavedQuery } from './creatable-saved-query';
import { RawCreatableSavedQuery } from './raw-creatable-saved-query';

export const toRawCreatableSavedQuery = (data: CreatableSavedQuery): RawCreatableSavedQuery =>
	omitUndefinedShallow({
		GUID: data.globalID,

		GIDs: (data.groupIDs ?? []).map(toRawNumericID),
		Global: data.isGlobal ?? false,

		Name: data.name,
		Description: data.description ?? '',
		Labels: data.labels ?? [],

		Query: data.query,
		Metadata: { timeframe: isNil(data.defaultTimeframe) ? null : toRawTimeframe(data.defaultTimeframe) },
	});

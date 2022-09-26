/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { DATA_TYPE } from '~/models';
import { RawSearch } from './raw-search';
import { Search } from './search';

export const toSearch = (raw: RawSearch): Search =>
	omitUndefinedShallow({
		_tag: DATA_TYPE.SEARCH,
		userID: raw.UID.toString(),
		groupID: raw.GID === 0 ? undefined : raw.GID.toString(),
		userQuery: raw.UserQuery,
		effectiveQuery: raw.EffectiveQuery,
		launchDate: new Date(raw.Launched),
	});

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { omitUndefinedShallow } from '~/functions/utils';
import { DATA_TYPE } from '~/models';
import { PersistentSearchDataState } from './persistent-search-data';
import { RawSearch2, RawSearch2State } from './raw-search2';
import { Search2 } from './search2';

export const toSearch2 = (raw: RawSearch2): Search2 =>
	omitUndefinedShallow({
		_tag: DATA_TYPE.PERSISTENT_SEARCH,
		id: raw.ID,
		userID: raw.UID.toString(),
		groupID: raw.GID === 0 ? undefined : raw.GID.toString(),
		states: (raw.State.split('/') as Array<RawSearch2State>).map(toSearch2State),
		attachedClients: raw.AttachedClients,
		storedData: raw.StoredData,
	});

const toSearch2State = (raw: RawSearch2State): PersistentSearchDataState => {
	switch (raw) {
		case 'ACTIVE':
			return 'active';
		case 'DORMANT':
			return 'dormant';
		case 'BACKGROUNDED':
			return 'backgrounded';
		case 'SAVED':
			return 'saved';
		case 'ATTACHED':
			return 'attached';
		case 'SAVING':
			return 'saving';
	}
};

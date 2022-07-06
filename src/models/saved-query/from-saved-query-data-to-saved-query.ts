/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { SavedQuery } from './saved-query';
import { SavedQueryData } from './saved-query-data';

export const fromSavedQueryDataToSavedQuery = (data: SavedQueryData): SavedQuery => ({
	...data,
	_tag: DATA_TYPE.SAVED_QUERY,
});

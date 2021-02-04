/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { makeGetSearchHistory } from '../../functions/searches';
import { APIContext } from '../../functions/utils';
import { Search } from '../../models/search';
import { isNumericID } from '../../value-objects';
import { SearchHistoryService } from './service';

export const createSearchHistoryService = (context: APIContext): SearchHistoryService => ({
	get: {
		mine: (): Promise<Array<Search>> => makeGetSearchHistory(context)({ target: 'myself' }),

		many: async (filter: { userID?: string; groupID?: string } = {}): Promise<Array<Search>> => {
			// TODO: Move it to /functions
			const getSearchHistory = makeGetSearchHistory(context);

			if (isNumericID(filter.userID) && isNumericID(filter.groupID)) {
				const groupHistory = await getSearchHistory({ target: 'group', groupID: filter.groupID });
				return groupHistory.filter(s => s.userID === filter.userID);
			}

			if (isNumericID(filter.userID)) return await getSearchHistory({ target: 'user', userID: filter.userID });

			if (isNumericID(filter.groupID)) return await getSearchHistory({ target: 'group', groupID: filter.groupID });

			return await getSearchHistory({ target: 'all' });
		},

		all: (): Promise<Array<Search>> => makeGetSearchHistory(context)({ target: 'all' }),

		authorizedTo: {
			user: (userID: string): Promise<Array<Search>> =>
				makeGetSearchHistory(context)({ target: 'user related', userID }),
		},
	},
});

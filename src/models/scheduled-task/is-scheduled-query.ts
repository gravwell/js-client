/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { DATA_TYPE } from '~/models';
import { isScheduledQueryData } from './is-scheduled-query-data';
import { ScheduledQuery } from './scheduled-query';

export const isScheduledQuery = (value: unknown): value is ScheduledQuery => {
	try {
		const sq = <ScheduledQuery>value;
		return sq._tag === DATA_TYPE.SCHEDULED_QUERY && isScheduledQueryData(sq);
	} catch {
		return false;
	}
};

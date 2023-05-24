/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Dashboard } from '~/models';
import { isNumericID, NumericID } from '~/value-objects';
import { APIContext } from '../utils';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsByGroup } from './get-dashboards-by-group';
import { makeGetDashboardsByUser } from './get-dashboards-by-user';

export const makeGetManyDashboards = (
	context: APIContext,
): ((filter?: DashboardsFilter) => Promise<Array<Dashboard>>) => {
	const getDashboardsByUser = makeGetDashboardsByUser(context);
	const getDashboardsByGroup = makeGetDashboardsByGroup(context);
	const getAllDashboards = makeGetAllDashboards(context);

	return async (filter: DashboardsFilter = {}): Promise<Array<Dashboard>> => {
		if (isNumericID(filter.userID) && isNumericID(filter.groupID)) {
			const groupID = filter.groupID;
			const userDashboards = await getDashboardsByUser(filter.userID);
			return userDashboards.filter(m => m.groupIDs.includes(groupID));
		}

		if (isNumericID(filter.userID)) {
			return getDashboardsByUser(filter.userID);
		}

		if (isNumericID(filter.groupID)) {
			return getDashboardsByGroup(filter.groupID);
		}

		return getAllDashboards();
	};
};

export interface DashboardsFilter {
	userID?: NumericID;
	groupID?: NumericID;
}

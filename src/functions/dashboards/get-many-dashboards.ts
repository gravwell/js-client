/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Dashboard } from '../../models';
import { isNumericID, NumericID } from '../../value-objects';
import { APIFunctionMakerOptions } from '../utils';
import { makeGetAllDashboards } from './get-all-dashboards';
import { makeGetDashboardsByGroup } from './get-dashboards-by-group';
import { makeGetDashboardsByUser } from './get-dashboards-by-user';

export const makeGetManyDashboards = (makerOptions: APIFunctionMakerOptions) => {
	const getDashboardsByUser = makeGetDashboardsByUser(makerOptions);
	const getDashboardsByGroup = makeGetDashboardsByGroup(makerOptions);
	const getAllDashboards = makeGetAllDashboards(makerOptions);

	return async (authToken: string | null, filter: DashboardsFilter = {}): Promise<Array<Dashboard>> => {
		if (isNumericID(filter.userID) && isNumericID(filter.groupID)) {
			const groupID = filter.groupID;
			const userDashboards = await getDashboardsByUser(authToken, filter.userID);
			return userDashboards.filter(m => m.groupIDs.includes(groupID));
		}

		if (isNumericID(filter.userID)) return getDashboardsByUser(authToken, filter.userID);

		if (isNumericID(filter.groupID)) return getDashboardsByGroup(authToken, filter.groupID);

		return getAllDashboards(authToken);
	};
};

export interface DashboardsFilter {
	userID?: NumericID;
	groupID?: NumericID;
}

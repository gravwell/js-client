/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil } from 'lodash';
import { APIContext } from '../utils';
import { makeDeleteOneScheduledScript } from './delete-one-scheduled-script';
import { makeGetAllScheduledScripts } from './get-all-scheduled-scripts';
import { ScheduledTasksFilter } from './get-many-scheduled-tasks';

export const makeDeleteManyScheduledScripts = (context: APIContext) => {
	const deleteOneScheduledScript = makeDeleteOneScheduledScript(context);
	const getAllScheduledScripts = makeGetAllScheduledScripts(context);

	return async (authToken: string | null, filter: ScheduledTasksFilter = {}): Promise<void> => {
		const scripts = await getAllScheduledScripts(authToken);
		const filtered = scripts.filter(s => {
			if (isNil(filter.userID)) return true;
			return s.userID === filter.userID;
		});

		const deletePs = filtered.map(s => deleteOneScheduledScript(authToken, s.id));
		await Promise.all(deletePs);
	};
};

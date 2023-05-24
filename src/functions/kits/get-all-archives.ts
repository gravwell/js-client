/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray } from 'lodash';
import { KitArchive, RawKitArchive, toKitArchive } from '~/models';
import { makeGetAllScheduledTasks } from '../scheduled-tasks/get-all-scheduled-tasks';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetKitArchives = (context: APIContext): (() => Promise<Array<KitArchive>>) => {
	const getAllScheduledTasks = makeGetAllScheduledTasks(context);

	return async (): Promise<Array<KitArchive>> => {
		const path = '/api/kits/build/history';
		const url = buildURL(path, { ...context, protocol: 'http' });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<Array<RawKitArchive>>(raw);

		const scheduledTasks = await getAllScheduledTasks();
		return isArray(rawRes) ? Promise.all(rawRes.map(rawKitArchive => toKitArchive(rawKitArchive, scheduledTasks))) : [];
	};
};

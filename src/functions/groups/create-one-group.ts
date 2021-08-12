/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableGroup, Group, toRawCreatableGroup } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneGroup } from './get-one-group';

export const makeCreateOneGroup = (context: APIContext) => {
	const getOneGroup = makeGetOneGroup(context);

	const templatePath = '/api/groups';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableGroup): Promise<Group> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableGroup(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<number>(raw);

			const groupID = rawID.toString();
			return await getOneGroup(groupID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

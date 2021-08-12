/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Group, toRawUpdatableGroup, UpdatableGroup } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneGroup } from './get-one-group';

export const makeUpdateOneGroup = (context: APIContext) => {
	return async (data: UpdatableGroup): Promise<Group> => {
		const getOneGroup = makeGetOneGroup(context);

		const templatePath = '/api/groups/{groupID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { groupID: data.id } });

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableGroup(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			await parseJSONResponse(raw, { expect: 'void' });
			return await getOneGroup(data.id);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

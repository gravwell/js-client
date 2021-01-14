/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSavedQuery, SavedQuery, toRawUpdatableSavedQuery, toSavedQuery, UpdatableSavedQuery } from '../../models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';
import { makeGetOneSavedQuery } from './get-one-saved-query';

export const makeUpdateOneSavedQuery = (context: APIContext) => {
	const getOneSavedQuery = makeGetOneSavedQuery(context);

	return async (authToken: string | null, data: UpdatableSavedQuery): Promise<SavedQuery> => {
		const templatePath = '/api/library/{savedQueryID}?admin=true';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { savedQueryID: data.id } });

		try {
			const current = await getOneSavedQuery(authToken, data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableSavedQuery(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawSavedQuery = await parseJSONResponse<RawSavedQuery>(raw);
			return toSavedQuery(rawSavedQuery);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

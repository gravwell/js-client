/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawSearchDetails } from '~/models/search/raw-search-details';
import { SearchDetails } from '~/models/search/search-details';
import { toSearchDetails } from '~/models/search/to-search-details';
import { toRawUpdatableSearchDetails } from '../../models/search/to-raw-updatable-search-details';
import { UpdatableSearchDetails } from '../../models/search/updatable-search-details';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOnePersistentSearchDetails } from './get-one-persistent-search-details';

export const makeUpdateOneSearchDetail = (
	context: APIContext,
): ((requestData: UpdatableSearchDetails) => Promise<SearchDetails>) => {
	const getOneSearchDetail = makeGetOnePersistentSearchDetails(context);
	return async (requestData: UpdatableSearchDetails): Promise<SearchDetails> => {
		const { ...data } = requestData;
		const current = await getOneSearchDetail(data.id);
		const templatePath = `/api/searchctrl/{searchDetailID}/save`;
		const templatePathGroup = `/api/searchctrl/{searchDetailID}/group`;

		const url = buildURL(data.groupID !== current.groupID ? templatePathGroup : templatePath, {
			...context,
			protocol: 'http',
			pathParams: { searchDetailID: data.id },
		});

		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableSearchDetails(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: url.includes('group') ? 'PUT' : 'PATCH' });
			const rawSearchDetails = await parseJSONResponse<RawSearchDetails>(raw);
			return toSearchDetails(rawSearchDetails);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

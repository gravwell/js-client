/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableSavedQuery } from '~/models/saved-query/creatable-saved-query';
import { RawSavedQuery } from '~/models/saved-query/raw-saved-query';
import { SavedQuery } from '~/models/saved-query/saved-query';
import { toRawCreatableSavedQuery } from '~/models/saved-query/to-raw-creatable-saved-query';
import { toSavedQuery } from '~/models/saved-query/to-saved-query';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeCreateOneSavedQuery = (context: APIContext): ((data: CreatableSavedQuery) => Promise<SavedQuery>) => {
	const templatePath = '/api/library';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableSavedQuery): Promise<SavedQuery> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableSavedQuery(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawSavedQuery>(raw);
			return toSavedQuery(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

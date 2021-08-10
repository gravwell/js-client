/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	AutoExtractor,
	RawAutoExtractor,
	toAutoExtractor,
	toRawUpdatableAutoExtractor,
	UpdatableAutoExtractor,
} from '~/models';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeUpdateOneAutoExtractor = (context: APIContext) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(context);

	return async (data: UpdatableAutoExtractor): Promise<AutoExtractor> => {
		const templatePath = '/api/autoextractors';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { autoExtractorID: data.id } });

		try {
			const allAutoExtractors = await getAllAutoExtractors();
			const current = <AutoExtractor>allAutoExtractors.find(ae => ae.id === data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableAutoExtractor(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawAutoExtractor = await parseJSONResponse<RawAutoExtractor>(raw);
			return toAutoExtractor(rawAutoExtractor);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

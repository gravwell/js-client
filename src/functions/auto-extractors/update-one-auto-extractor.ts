/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
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
} from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeUpdateOneAutoExtractor = (makerOptions: APIFunctionMakerOptions) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(makerOptions);

	return async (authToken: string | null, data: UpdatableAutoExtractor): Promise<AutoExtractor> => {
		const templatePath = '/api/autoextractors';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { autoExtractorID: data.id } });

		try {
			const allAutoExtractors = await getAllAutoExtractors(authToken);
			const current = <AutoExtractor>allAutoExtractors.find(ae => ae.id === data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
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

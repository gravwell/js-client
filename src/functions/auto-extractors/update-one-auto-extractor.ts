/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import {
	AutoExtractor,
	RawAutoExtractor,
	toAutoExtractor,
	toRawUpdatableAutoExtractor,
	UpdatableAutoExtractor,
} from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
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
				body: JSON.stringify(toRawUpdatableAutoExtractor(data, current)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawAutoExtractor | ErrorResponse>(raw);
			if (isErrorResponse(rawRes)) {
				throw Error(rawRes.Error);
			}

			return toAutoExtractor(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface ErrorResponse {
	Error: string;
}

const isErrorResponse = (v: unknown): v is ErrorResponse => {
	try {
		const o = v as ErrorResponse;
		return isString(o.Error);
	} catch {
		return false;
	}
};

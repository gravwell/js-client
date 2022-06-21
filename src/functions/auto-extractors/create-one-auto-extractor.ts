/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString } from 'lodash';
import { AutoExtractor, CreatableAutoExtractor, toRawCreatableAutoExtractor } from '~/models';
import { RawNumericID, toNumericID } from '~/value-objects';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeCreateOneAutoExtractor = (context: APIContext) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(context);

	const templatePath = '/api/autoextractors';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableAutoExtractor): Promise<AutoExtractor> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableAutoExtractor(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawNumericID | ErrorResponse>(raw);
			if (isErrorResponse(rawRes)) {
				throw Error(rawRes.Error);
			}

			const autoExtractorID = toNumericID(rawRes);

			const allAutoExtractors = await getAllAutoExtractors();
			const autoExtractor = <AutoExtractor>allAutoExtractors.find(ae => ae.id === autoExtractorID);
			return autoExtractor;
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

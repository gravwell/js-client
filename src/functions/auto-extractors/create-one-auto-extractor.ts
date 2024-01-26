/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isString } from 'lodash';
import { AutoExtractor } from '~/models/auto-extractor/auto-extractor';
import { CreatableAutoExtractor } from '~/models/auto-extractor/creatable-auto-extractor';
import { toRawCreatableAutoExtractor } from '~/models/auto-extractor/to-raw-creatable-auto-extractor';
import { RawNumericID, toNumericID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeCreateOneAutoExtractor = (
	context: APIContext,
): ((data: CreatableAutoExtractor) => Promise<AutoExtractor>) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(context);

	const templatePath = '/api/autoextractors';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableAutoExtractor): Promise<AutoExtractor> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableAutoExtractor(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawNumericID | ErrorResponse>(raw);
			if (isErrorResponse(rawRes)) {
				throw Error(rawRes.Error);
			}

			const autoExtractorID = toNumericID(rawRes);

			const allAutoExtractors = await getAllAutoExtractors();
			const autoExtractor = allAutoExtractors.find(ae => ae.id === autoExtractorID) as AutoExtractor;
			return autoExtractor;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
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

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
import { RawAutoExtractor } from '~/models/auto-extractor/raw-auto-extractor';
import { toAutoExtractor } from '~/models/auto-extractor/to-auto-extractor';
import { toRawUpdatableAutoExtractor } from '~/models/auto-extractor/to-raw-updatable-auto-extractor';
import { UpdatableAutoExtractor } from '~/models/auto-extractor/updatable-auto-extractor';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeUpdateOneAutoExtractor = (
	context: APIContext,
): ((data: UpdatableAutoExtractor) => Promise<AutoExtractor>) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(context);

	return async (data: UpdatableAutoExtractor): Promise<AutoExtractor> => {
		const templatePath = '/api/autoextractors';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { autoExtractorID: data.id } });

		try {
			const allAutoExtractors = await getAllAutoExtractors();
			const current = allAutoExtractors.find(ae => ae.id === data.id) as AutoExtractor;

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableAutoExtractor(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawAutoExtractor | ErrorResponse>(raw);
			if (isErrorResponse(rawRes)) {
				throw Error(rawRes.Error);
			}

			return toAutoExtractor(rawRes);
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

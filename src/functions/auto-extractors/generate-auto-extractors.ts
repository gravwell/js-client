/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { GeneratableAutoExtractor } from '~/models/auto-extractor/generatable-auto-extractor';
import { GeneratedAutoExtractors } from '~/models/auto-extractor/generated-auto-extractors';
import { RawGeneratedAutoExtractors } from '~/models/auto-extractor/raw-generated-auto-extrators';
import { toGeneratedAutoExtractors } from '~/models/auto-extractor/to-generated-auto-extractor';
import { toRawGeneratableAutoExtractor } from '~/models/auto-extractor/to-raw-generatable-auto-extractor';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGenerateAutoExtractors = (
	context: APIContext,
): ((data: GeneratableAutoExtractor) => Promise<GeneratedAutoExtractors>) => {
	const templatePath = '/api/explore/generate';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: GeneratableAutoExtractor): Promise<GeneratedAutoExtractors> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawGeneratableAutoExtractor(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawGeneratedAutoExtractors>(raw);

			return toGeneratedAutoExtractors(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

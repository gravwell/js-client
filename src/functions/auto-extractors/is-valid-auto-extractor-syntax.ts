/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableAutoExtractor, toRawCreatableAutoExtractor } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeIsValidAutoExtractorSyntax = (context: APIContext) => {
	const templatePath = '/api/autoextractors';
	const url = buildURL(templatePath, { ...context, protocol: 'http' });

	return async (data: CreatableAutoExtractor): Promise<IsValidAutoExtractorSyntaxResponse> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatableAutoExtractor(data)),
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawIsValidAutoExtractorSyntaxResponse>(raw, { returnError: true });
			return toIsValidAutoExtractorSyntaxResponse(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface RawIsValidAutoExtractorSyntaxResponse {
	TagExists?: boolean;
	Error?: string;
}

export type IsValidAutoExtractorSyntaxResponse = { isTagInUse: boolean } & (
	| { isValidSyntax: true; syntaxErrorMessage: null }
	| { isValidSyntax: false; syntaxErrorMessage: string }
);

const toIsValidAutoExtractorSyntaxResponse = (
	raw: RawIsValidAutoExtractorSyntaxResponse,
): IsValidAutoExtractorSyntaxResponse => {
	const trimmedError = (raw.Error ?? '').trim();
	const isTagInUse = raw.TagExists ?? false;
	const isValidSyntax = trimmedError === '' && raw.TagExists === false;

	switch (isValidSyntax) {
		case true:
			return { isTagInUse, isValidSyntax: true, syntaxErrorMessage: null };
		case false:
			return { isTagInUse, isValidSyntax: false, syntaxErrorMessage: trimmedError };
	}
};

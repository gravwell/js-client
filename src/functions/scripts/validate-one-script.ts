/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Script } from '../../models';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeValidateOneScript = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/scheduledsearches/parse';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, script: Script): Promise<ValidatedScript> => {
		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
			body: JSON.stringify({ Script: script }),
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'PUT' });
		const rawRes = await parseJSONResponse<RawValidatedScript>(raw);
		return toValidatedScript(rawRes);
	};
};

interface RawValidatedScript {
	OK: boolean;
	Error?: string;
	ErrorLine: number; // -1 is null
	ErrorColumn: number; // -1 is null
}

interface ScriptError {
	message: string;
	line: number | null;
	column: number | null;
}

export type ValidatedScript = { isValid: true; error: null } | { isValid: false; error: ScriptError };

const toValidatedScript = (raw: RawValidatedScript): ValidatedScript => {
	switch (raw.OK) {
		case true:
			return {
				isValid: true,
				error: null,
			};
		case false:
			return {
				isValid: false,
				error: {
					message: raw.Error ?? 'Unknown error',
					line: raw.ErrorLine === -1 ? null : raw.ErrorLine,
					column: raw.ErrorColumn === -1 ? null : raw.ErrorColumn,
				},
			};
	}
};

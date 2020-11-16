/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Macro } from '../../models';
import { NumericID, RawNumericID, toNumericID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneMacro } from './get-one-macro';

export const makeCreateOneMacro = (makerOptions: APIFunctionMakerOptions) => {
	const getOneMacro = makeGetOneMacro(makerOptions);

	const templatePath = '/api/macros';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableMacro): Promise<Macro> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableMacro(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawNumericID>(raw);
			const macroID = toNumericID(rawRes);
			return getOneMacro(authToken, macroID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableMacro {
	groupIDs?: Array<NumericID>;

	/**
	 * All uppercase and no spaces.
	 */
	name: string;
	description?: string | null;
	labels?: Array<string>;

	expansion: string;
}

interface RawCreatableMacro {
	GIDs: Array<RawNumericID>;
	Name: string;
	Description: string | null;
	Expansion: string;
	Labels: Array<string>;
}

const toRawCreatableMacro = (creatable: CreatableMacro): RawCreatableMacro => ({
	GIDs: creatable.groupIDs?.map(toRawNumericID) ?? [],

	Name: creatable.name.trim(),
	Description: creatable.description?.trim() ?? null,
	Labels: creatable.labels ?? [],

	Expansion: creatable.expansion,
});

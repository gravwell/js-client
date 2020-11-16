/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { Macro, RawMacro, toMacro } from '../../models';
import { NumericID, RawNumericID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneMacro } from './get-one-macro';

export const makeUpdateOneMacro = (makerOptions: APIFunctionMakerOptions) => {
	const getOneMacro = makeGetOneMacro(makerOptions);

	return async (authToken: string | null, data: UpdatableMacro): Promise<Macro> => {
		const templatePath = '/api/macros/{macroID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { macroID: data.id } });

		try {
			const current = await getOneMacro(authToken, data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableMacro(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawMacro = await parseJSONResponse<RawMacro>(raw);
			return toMacro(rawMacro);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableMacro {
	id: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string | null;
	labels?: Array<string>;

	expansion?: string;
}

interface RawUpdatableMacro {
	GIDs: Array<RawNumericID>;

	Name: string;
	Description: string; // Use empty string for null
	Labels: Array<string>;

	Expansion: string;
}

const toRawUpdatableMacro = (updatable: UpdatableMacro, current: Macro): RawUpdatableMacro => ({
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

	Name: updatable.name ?? current.name,
	Description: (isUndefined(updatable.description) ? current.description : updatable.description) ?? '',
	Labels: updatable.labels ?? current.labels,

	Expansion: updatable.expansion ?? current.expansion,
});

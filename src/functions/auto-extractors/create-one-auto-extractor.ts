/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { AutoExtractor, AutoExtractorModule, RawAutoExtractorModule } from '../../models';
import { NumericID, RawNumericID, toNumericID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeCreateOneAutoExtractor = (makerOptions: APIFunctionMakerOptions) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(makerOptions);

	const templatePath = '/api/autoextractors';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableAutoExtractor): Promise<AutoExtractor> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableAutoExtractor(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawNumericID>(raw);
			const autoExtractorID = toNumericID(rawRes);

			const allAutoExtractors = await getAllAutoExtractors(authToken);
			const autoExtractor = <AutoExtractor>allAutoExtractors.find(ae => ae.id === autoExtractorID);
			return autoExtractor;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableAutoExtractor {
	groupIDs?: Array<NumericID>;

	name: string;
	description: string;
	labels?: Array<string>;
	isGlobal?: boolean;

	tag: string;
	module: AutoExtractorModule;
	parameters: string;
	arguments?: string | null;
}

export interface RawCreatableAutoExtractor {
	GIDs: Array<RawNumericID>;

	Name: string;
	Desc: string;
	Labels: Array<string>;

	Global: boolean;

	Tag: string;
	Module: RawAutoExtractorModule;
	Params: string;
	Args: string; // empty string is null
}

export const toRawCreatableAutoExtractor = (data: CreatableAutoExtractor): RawCreatableAutoExtractor => ({
	GIDs: (data.groupIDs ?? []).map(toRawNumericID),

	Name: data.name,
	Desc: data.description,
	Labels: data.labels ?? [],

	Global: data.isGlobal ?? false,

	Tag: data.tag,
	Module: data.module,
	Params: data.parameters,
	Args: data.arguments ?? '',
});

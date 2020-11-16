/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import {
	AutoExtractor,
	AutoExtractorModule,
	RawAutoExtractor,
	RawAutoExtractorModule,
	toAutoExtractor,
} from '../../models';
import { NumericID, RawNumericID, RawUUID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';

export const makeUpdateOneAutoExtractor = (makerOptions: APIFunctionMakerOptions) => {
	const getAllAutoExtractors = makeGetAllAutoExtractors(makerOptions);

	return async (authToken: string | null, data: UpdatableAutoExtractor): Promise<AutoExtractor> => {
		const templatePath = '/api/autoextractors';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { autoExtractorID: data.id } });

		try {
			const allAutoExtractors = await getAllAutoExtractors(authToken);
			const current = <AutoExtractor>allAutoExtractors.find(ae => ae.id === data.id);

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableAutoExtractor(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'PUT' });
			const rawAutoExtractor = await parseJSONResponse<RawAutoExtractor>(raw);
			return toAutoExtractor(rawAutoExtractor);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableAutoExtractor {
	id: NumericID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string;
	labels?: Array<string>;

	isGlobal?: boolean;

	tag?: string;
	module?: AutoExtractorModule;
	parameters?: string;
	arguments?: string | null;
}

interface RawUpdatableAutoExtractor {
	UUID: RawUUID;
	GIDs: Array<RawNumericID>;

	Name: string;
	Desc: string;
	Labels: Array<string>;

	Global: boolean;

	Tag: string;
	Module: RawAutoExtractorModule;
	Params: string;
	Args: string; // Empty string is null
}

const toRawUpdatableAutoExtractor = (
	updatable: UpdatableAutoExtractor,
	current: AutoExtractor,
): RawUpdatableAutoExtractor => ({
	UUID: current.id,
	GIDs: (updatable.groupIDs ?? current.groupIDs).map(toRawNumericID),

	Name: updatable.name ?? current.name,
	Desc: updatable.description ?? current.description,
	Labels: updatable.labels ?? current.labels,
	Global: updatable.isGlobal ?? current.isGlobal,

	Tag: updatable.tag ?? current.tag,
	Module: updatable.module ?? current.module,
	Params: updatable.parameters ?? current.parameters,
	Args: (isUndefined(updatable.arguments) ? current.arguments : updatable.arguments) ?? '',
});

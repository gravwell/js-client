/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawResource, Resource, toResource } from '../../models';
import { NumericID, RawNumericID, toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeCreateOneResource = (makerOptions: APIFunctionMakerOptions) => {
	const resourcePath = '/api/resources';
	const url = buildURL(resourcePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: CreatableResource): Promise<Resource> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableResource(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<RawResource>(raw);
			return toResource(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableResource {
	groupIDs?: Array<NumericID>;

	name: string;
	description: string;
	labels?: Array<string>;

	isGlobal?: boolean;
}

interface RawCreatableResource {
	ResourceName: string;
	Description: string;

	GroupACL: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;
}

const toRawCreatableResource = (creatable: CreatableResource): RawCreatableResource => ({
	GroupACL: creatable.groupIDs?.map(id => toRawNumericID(id)) ?? [],

	Global: creatable.isGlobal ?? false,
	Labels: creatable.labels ?? [],

	ResourceName: creatable.name,
	Description: creatable.description,
});

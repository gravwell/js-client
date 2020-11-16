/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isUndefined } from 'lodash';
import { RawResource, Resource, toResource } from '../../models';
import { NumericID, RawNumericID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	File,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOneResource } from './get-one-resource';
import { makeSetOneResourceContent } from './set-one-resource-content';

export const makeUpdateOneResource = (makerOptions: APIFunctionMakerOptions) => {
	const getOneResource = makeGetOneResource(makerOptions);
	const setOneResourceContent = makeSetOneResourceContent(makerOptions);

	return async (authToken: string | null, data: UpdatableResource): Promise<Resource> => {
		try {
			// TODO: We shouldn't have to query the current object before updating
			const current = await getOneResource(authToken, data.id);

			// The resources will be inserted in order and we'll return the last one inserted because that's the most updated one
			const resources: Array<Resource> = [current];
			const insertResource = (resource: Resource): Resource => {
				resources.push(resource);
				return resource;
			};

			const resourcePath = '/api/resources/{resourceID}';
			const url = buildURL(resourcePath, { ...makerOptions, protocol: 'http', pathParams: { resourceID: data.id } });

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawUpdatableResource(data, current)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const metadataP = fetch(url, { ...req, method: 'PUT' })
				.then(res => parseJSONResponse<RawResource>(res))
				.then(toResource)
				.then(insertResource);

			const contentP: Promise<void | Resource> = isUndefined(data.body)
				? Promise.resolve()
				: setOneResourceContent(authToken, data.id, data.body).then(insertResource);

			await Promise.all([metadataP, contentP]);

			const lastUpdatedResource = resources[resources.length - 1];
			return lastUpdatedResource;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface UpdatableResource {
	id: UUID;
	groupIDs?: Array<NumericID>;

	name?: string;
	description?: string;
	labels?: Array<string>;

	body?: File;

	isGlobal?: boolean;
}

interface RawUpdatableResourceMetadata {
	ResourceName: string;
	Description: string;

	GroupACL: Array<RawNumericID>;

	Global: boolean;
	Labels: Array<string>;
}

const toRawUpdatableResource = (creatable: UpdatableResource, current: Resource): RawUpdatableResourceMetadata => ({
	GroupACL: (creatable.groupIDs ?? current.groupIDs).map(id => toRawNumericID(id)),

	Global: creatable.isGlobal ?? current.isGlobal,
	Labels: creatable.labels ?? current.labels,

	ResourceName: creatable.name ?? current.name,
	Description: creatable.description ?? current.description,
});

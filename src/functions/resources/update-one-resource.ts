/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil, isUndefined } from 'lodash';
import { RawResource, Resource, toRawUpdatableResourceMetadata, toResource, UpdatableResource } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOneResource } from './get-one-resource';
import { makeSetOneResourceContent } from './set-one-resource-content';

export const makeUpdateOneResource = (context: APIContext): ((data: UpdatableResource) => Promise<Resource>) => {
	const getOneResource = makeGetOneResource(context);
	const setOneResourceContent = makeSetOneResourceContent(context);

	return async (data: UpdatableResource): Promise<Resource> => {
		try {
			// TODO: We shouldn't have to query the current object before updating
			const current = await getOneResource(data.id);

			// The resources will be inserted in order and we'll return the last one inserted because that's the most updated one
			const resources: Array<Resource> = [current];
			const insertResource = (resource: Resource): Resource => {
				resources.push(resource);
				return resource;
			};

			const resourcePath = '/api/resources/{resourceID}';
			const url = buildURL(resourcePath, { ...context, protocol: 'http', pathParams: { resourceID: data.id } });

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatableResourceMetadata(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const metadataP = context
				.fetch(url, { ...req, method: 'PUT' })
				.then(res => parseJSONResponse<RawResource>(res))
				.then(toResource)
				.then(insertResource);

			const contentP: Promise<void | Resource> = isUndefined(data.body)
				? Promise.resolve()
				: setOneResourceContent(data.id, data.body).then(insertResource);

			await Promise.all([metadataP, contentP]);

			const lastUpdatedResource = resources[resources.length - 1];
			if (isNil(lastUpdatedResource)) {
				throw new Error('No resources');
			}

			return lastUpdatedResource;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

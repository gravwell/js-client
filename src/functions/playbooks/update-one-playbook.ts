/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Playbook, RawPlaybook, toPlaybook, toRawUpdatablePlaybook, UpdatablePlaybook } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOnePlaybook } from './get-one-playbook';

export const makeUpdateOnePlaybook = (context: APIContext): ((data: UpdatablePlaybook) => Promise<Playbook>) => {
	const getOnePlaybook = makeGetOnePlaybook(context);

	return async (data: UpdatablePlaybook): Promise<Playbook> => {
		try {
			// TODO: We shouldn't have to query the current object before updating
			const current = await getOnePlaybook(data.id);

			const playbookPath = '/api/playbooks/{playbookID}';
			const url = buildURL(playbookPath, {
				...context,
				protocol: 'http',
				pathParams: { playbookID: data.id },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawUpdatablePlaybook(data, current)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawPlaybook>(raw);
			return toPlaybook(rawRes);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

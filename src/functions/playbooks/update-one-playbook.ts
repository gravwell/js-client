/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Playbook, RawPlaybook, toPlaybook, toRawUpdatablePlaybook, UpdatablePlaybook } from '~/models';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';
import { makeGetOnePlaybook } from './get-one-playbook';

export const makeUpdateOnePlaybook = (context: APIContext) => {
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
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'PUT' });
			const rawRes = await parseJSONResponse<RawPlaybook>(raw);
			return toPlaybook(rawRes);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

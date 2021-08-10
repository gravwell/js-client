/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatablePlaybook, Playbook, toRawCreatablePlaybook } from '~/models';
import { UUID } from '~/value-objects';
import { APIContext, buildHTTPRequest, buildURL, fetch, HTTPRequestOptions, parseJSONResponse } from '../utils';
import { makeGetOnePlaybook } from './get-one-playbook';

export const makeCreateOnePlaybook = (context: APIContext) => {
	const getOnePlaybook = makeGetOnePlaybook(context);

	const playbookPath = '/api/playbooks';
	const url = buildURL(playbookPath, { ...context, protocol: 'http' });

	return async (data: CreatablePlaybook): Promise<Playbook> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined },
				body: JSON.stringify(toRawCreatablePlaybook(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<UUID>(raw);

			const playbookID = rawID.toString();
			return await getOnePlaybook(playbookID);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

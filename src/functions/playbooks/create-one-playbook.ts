/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatablePlaybook } from '~/models/playbook/creatable-playbook';
import { Playbook } from '~/models/playbook/playbook';
import { toRawCreatablePlaybook } from '~/models/playbook/to-raw-creatable-playbook';
import { UUID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { HTTPRequestOptions } from '../utils/http-request-options';
import { parseJSONResponse } from '../utils/parse-json-response';
import { makeGetOnePlaybook } from './get-one-playbook';

export const makeCreateOnePlaybook = (context: APIContext): ((data: CreatablePlaybook) => Promise<Playbook>) => {
	const getOnePlaybook = makeGetOnePlaybook(context);

	const playbookPath = '/api/playbooks';
	const url = buildURL(playbookPath, { ...context, protocol: 'http' });

	return async (data: CreatablePlaybook): Promise<Playbook> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				body: JSON.stringify(toRawCreatablePlaybook(data)),
				headers: { 'Content-Type': 'application/json' },
			};
			const req = buildHTTPRequestWithAuthFromContext(context, baseRequestOptions);

			const raw = await context.fetch(url, { ...req, method: 'POST' });
			const rawID = await parseJSONResponse<UUID>(raw);

			const playbookID = rawID.toString();
			return await getOnePlaybook(playbookID);
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};
};

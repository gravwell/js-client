/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Playbook } from '~/models/playbook/playbook';
import { RawPlaybook } from '~/models/playbook/raw-playbook';
import { toPlaybook } from '~/models/playbook/to-playbook';
import { UUID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetOnePlaybook =
	(context: APIContext) =>
	async (playbookID: UUID): Promise<Playbook> => {
		const playbookPath = '/api/playbooks/{playbookID}';
		const url = buildURL(playbookPath, { ...context, protocol: 'http', pathParams: { playbookID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = await parseJSONResponse<RawPlaybook>(raw);
		return toPlaybook(rawRes);
	};

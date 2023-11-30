/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Playbook, RawPlaybook, toPlaybook } from '~/models';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';

export const makeGetAllPlaybooksRelatedToMe = (context: APIContext): (() => Promise<Array<Omit<Playbook, 'body'>>>) => {
	const playbookPath = '/api/playbooks';
	const url = buildURL(playbookPath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Omit<Playbook, 'body'>>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawPlaybook> | null>(raw)) ?? [];
		return rawRes.map(p => toPlaybook(p, { includeBody: false }));
	};
};

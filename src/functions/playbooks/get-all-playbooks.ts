/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Playbook, RawPlaybook, toPlaybook } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, parseJSONResponse } from '../utils';

export const makeGetAllPlaybooks = (context: APIContext): (() => Promise<Array<Omit<Playbook, 'body'>>>) => {
	const playbookPath = '/api/playbooks?admin=true';
	const url = buildURL(playbookPath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Omit<Playbook, 'body'>>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await context.fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawPlaybook> | null>(raw)) ?? [];
		return rawRes.map(p => toPlaybook(p, { includeBody: false }));
	};
};

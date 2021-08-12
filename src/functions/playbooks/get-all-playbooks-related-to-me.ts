/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Playbook, RawPlaybook, toPlaybook } from '~/models';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse } from '../utils';

export const makeGetAllPlaybooksRelatedToMe = (context: APIContext) => {
	const playbookPath = '/api/playbooks';
	const url = buildURL(playbookPath, { ...context, protocol: 'http' });

	return async (): Promise<Array<Omit<Playbook, 'body'>>> => {
		const req = buildHTTPRequestWithAuthFromContext(context);

		const raw = await fetch(url, { ...req, method: 'GET' });
		const rawRes = (await parseJSONResponse<Array<RawPlaybook> | null>(raw)) ?? [];
		return rawRes.map(p => toPlaybook(p, { includeBody: false }));
	};
};

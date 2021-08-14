/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { MailServerTestData } from "~/models";
import {APIContext, buildHTTPRequestWithAuthFromContext, buildURL, fetch, parseJSONResponse} from '../utils';
import { toRawMailServerTestData } from './conversion';
import {MAIL_PATH} from './paths';

export const makeCreateServerTest = (context: APIContext) => {
	return async (data: MailServerTestData): Promise<string> => {
		try {
			const url = buildURL(MAIL_PATH, { ...context, protocol: 'http' });
			const req = buildHTTPRequestWithAuthFromContext(context, {
				body: JSON.stringify(toRawMailServerTestData(data)),
			});
			const rawRes = await fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(rawRes, { expect: 'text'});
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	}
}

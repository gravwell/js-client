/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isMailServerTestResult } from '~/models/mail-server/is-mail-server-test-result';
import { MailServerTestData } from '~/models/mail-server/mail-server-test-data';
import { MailServerTestResult } from '~/models/mail-server/mail-server-test-result';
import { APIContext } from '../utils/api-context';
import { buildHTTPRequestWithAuthFromContext } from '../utils/build-http-request';
import { buildURL } from '../utils/build-url';
import { parseJSONResponse } from '../utils/parse-json-response';
import { toRawMailServerTestData } from './conversion';
import { MAIL_PATH } from './paths';

export const makeCreateServerTest =
	(context: APIContext) =>
	async (data: MailServerTestData): Promise<MailServerTestResult> => {
		try {
			const url = buildURL(MAIL_PATH, { ...context, protocol: 'http' });
			const req = buildHTTPRequestWithAuthFromContext(context, {
				body: JSON.stringify(toRawMailServerTestData(data)),
				headers: { 'Content-Type': 'application/json' },
			});
			const rawRes = await context.fetch(url, { ...req, method: 'POST' });

			// The backend returns a JSON-encoded string
			const result = await parseJSONResponse(rawRes);

			// Throw if the result is not a known result
			if (!isMailServerTestResult(result)) {
				throw Error(`Unexpected mail server test result: ${result}`);
			}

			return result;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

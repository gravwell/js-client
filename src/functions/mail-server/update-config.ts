/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { MailServerConfig } from '../../models/mail-server';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL } from '../utils';
import { toRawMailServerConfig } from './conversion';
import { MAIL_CONFIG_PATH } from './paths';

export const makeUpdateConfig =
	(context: APIContext) =>
	async (config: MailServerConfig): Promise<boolean> => {
		try {
			const url = buildURL(MAIL_CONFIG_PATH, { ...context, protocol: 'http' });
			const req = buildHTTPRequestWithAuthFromContext(context, {
				body: JSON.stringify(toRawMailServerConfig(config)),
				headers: { 'Content-Type': 'application/json' },
			});
			const rawRes = await context.fetch(url, { ...req, method: 'POST' });
			// The API response is empty so we just check on status
			return rawRes.status === 200;
		} catch (err) {
			if (err instanceof Error) {
				throw err;
			}
			throw Error('Unknown error');
		}
	};

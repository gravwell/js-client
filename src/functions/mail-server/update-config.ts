/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {APIContext, buildHTTPRequestWithAuthFromContext, fetch, buildURL, parseJSONResponse} from '../utils';
import {MAIL_CONFIG_PATH} from './paths';
import {MailServerConfig, RawMailServerConfig} from '../../models/mail-server';
import {toMailServerConfig, toRawMailServerConfig} from './conversion';

export const makeUpdateConfig = (context: APIContext) => {
	return async (config: MailServerConfig): Promise<boolean> => {
		try {
			const url = buildURL(MAIL_CONFIG_PATH, { ...context, protocol: 'http' });
			const req = buildHTTPRequestWithAuthFromContext(context, {
				body: JSON.stringify(toRawMailServerConfig(config)),
			});
			const rawRes = await fetch(url, {...req, method: 'POST'});
			// The API response is empty so we just check on status
			return rawRes.status === 200;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	}
}

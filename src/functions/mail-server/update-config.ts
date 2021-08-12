/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {APIContext, buildHTTPRequestWithContextToken, fetch, parseJSONResponse} from '../utils';
import {MAIL_CONFIG_PATH} from './paths';
import {MailServerConfig, RawMailServerConfig} from '../../models/mail-server';
import {toMailServerConfig, toRawMailServerConfig} from './conversion';

export const makeUpdateConfig = (context: APIContext) => {
	return async (config: MailServerConfig): Promise<MailServerConfig> => {
		try {
			const req = buildHTTPRequestWithContextToken(context, {
				body: JSON.stringify(toRawMailServerConfig(config)),
			});
			const rawRes = await fetch(MAIL_CONFIG_PATH, {...req, method: 'POST'});
			const rawObj = await parseJSONResponse<RawMailServerConfig>(rawRes);
			return toMailServerConfig(rawObj);
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	}
}

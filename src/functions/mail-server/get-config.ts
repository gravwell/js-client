/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {MailServerConfig, RawMailServerConfig} from '../../models/mail-server';
import {
	APIContext,
	buildHTTPRequestWithAuthFromContext,
	buildURL,
	fetch,
	parseJSONResponse,
} from '../utils';
import {toMailServerConfig} from './conversion';
import {MAIL_CONFIG_PATH} from './paths';

/**
 * Makes request to get mail server config
 * @param context
 */
export const makeGetConfig = (context: APIContext) => {
	return async (): Promise<MailServerConfig> => {
		const url = buildURL(MAIL_CONFIG_PATH, { ...context, protocol: 'http' });
		const req = buildHTTPRequestWithAuthFromContext(context);
		const res = await fetch(url, { ...req, method: 'GET' });
		const rawObj = await parseJSONResponse<RawMailServerConfig>(res);
		return toMailServerConfig(rawObj);
	};
}

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	APIContext, buildAuthorizedHTTPRequest,
	fetch,
	parseJSONResponse
} from '../utils';
import {MailServerConfig, RawMailServerConfig} from '../../models/mail-server';
import {MAIL_CONFIG_PATH} from './paths';
import {toMailServerConfig} from './conversion';

/**
 * Makes request to get mail server config
 * @param context
 */
export const makeGetConfig = (context: APIContext) => {
	return async (): Promise<MailServerConfig> => {
		const req = buildAuthorizedHTTPRequest({});
		const rawRes = await fetch(MAIL_CONFIG_PATH, { ...req, method: 'GET' });
		const rawObj = await parseJSONResponse<RawMailServerConfig>(rawRes);
		return toMailServerConfig(rawObj);
	};
}


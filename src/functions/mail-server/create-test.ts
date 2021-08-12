/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { MailServerTestData } from '~/models/mail-server';
import {APIContext, buildHTTPRequestWithContextToken, parseJSONResponse} from '../utils';
import { toRawMailServerTestData } from './conversion';
import {MAIL_PATH} from './paths';

export const makeCreateTest = (context: APIContext) => {
	return async (data: MailServerTestData): Promise<string> => {
		try {
			const req = buildHTTPRequestWithContextToken(context, {
				body: JSON.stringify(toRawMailServerTestData(data)),
			});
			const rawRes = await fetch(MAIL_PATH, {...req, method: 'POST'});
			const rawObj = await parseJSONResponse<string>(rawRes);
			return rawObj;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	}
}

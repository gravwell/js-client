/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { MailServerTestResult } from './mail-server-test-result';

export const isMailServerTestResult = (v: any): v is MailServerTestResult => {
	const r = v as MailServerTestResult;
	return r === 'enqueued' || r === 'success';
};

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { HTTPRequestOptions } from './http-request-options';
import { omitUndefinedShallow } from './omit-undefined-shallow';
import { RequestInit } from './request-init';

export const buildHTTPRequest = (base: HTTPRequestOptions): RequestInit => {
	const headers = omitUndefinedShallow({
		...(base.headers ?? {}),
	});
	const body = base.body ?? undefined;
	return { headers, body };
};

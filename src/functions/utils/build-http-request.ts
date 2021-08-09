/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { HTTPRequestOptions } from './http-request-options';
import { omitUndefinedShallow } from './omit-undefined-shallow';
import { RequestInit } from './request-init';
import {APIContext} from './api-context';

export const buildHTTPRequest = (base: HTTPRequestOptions): RequestInit => {
	const headers = omitUndefinedShallow({
		...(base.headers ?? {}),
	});
	const body = base.body ?? undefined;
	return { headers, body };
};

/**
 * Builds a request and adds the auth token
 * @param context
 * @param base
 */
export const buildAuthorizedHTTPRequest = (context: APIContext, base: HTTPRequestOptions = {}): RequestInit => {
	const headers = omitUndefinedShallow({
		...(base.headers ?? {}),
		Authorization: context.authToken ? `Bearer ${context.authToken}` : undefined,
	});

	base.headers = headers;
	return buildHTTPRequest(base);
};

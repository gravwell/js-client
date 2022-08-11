/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNotNull } from '@lucaspaganini/value-objects/dist/utils';
import { isString } from 'lodash';
import { APIContext } from './api-context';
import { HTTPRequestOptions } from './http-request-options';
import { omitUndefinedShallow } from './omit-undefined-shallow';
import { RequestInit } from './request-init';

export const buildHTTPRequest = (base: HTTPRequestOptions): RequestInit => {
	const headers = omitUndefinedShallow({
		...(base.headers ?? {}),
	});
	const body = base.body ?? undefined;
	return omitUndefinedShallow({ headers, body });
};

export const buildHTTPRequestWithAuthFromContext = (context: APIContext, base: HTTPRequestOptions = {}): RequestInit =>
	isString(context.authToken) ? buildHTTPRequestWithAuth(context.authToken, base) : buildHTTPRequest(base);

export const buildHTTPRequestWithAuth = (authToken: string, base: HTTPRequestOptions = {}): RequestInit =>
	addTokenToRequest(authToken, buildHTTPRequest(base));

const addTokenToRequest = (authToken: string | null, request: RequestInit): RequestInit => {
	if (isNotNull(authToken)) {
		request.headers = {
			...request.headers,
			Authorization: `Bearer ${authToken}`,
		};
	}
	return request;
};

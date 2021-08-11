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
import {isString} from 'lodash';
import {isNotNull} from '@lucaspaganini/value-objects/dist/utils';

export const buildHTTPRequest = (base: HTTPRequestOptions): RequestInit => {
	const headers = omitUndefinedShallow({
		...(base.headers ?? {}),
	});
	const body = base.body ?? undefined;
	return { headers, body };
};


export const buildHTTPRequestWithContextToken = (
	context: APIContext,
	base: HTTPRequestOptions = {}
): RequestInit => {
	return isString(context.authToken) ? buildHTTPRequestWithToken(context.authToken) : buildHTTPRequest(base);
}

export const buildHTTPRequestWithToken = (
	authToken: string,
	base: HTTPRequestOptions = {}
): RequestInit => {
	return addTokenToRequest(authToken, buildHTTPRequest(base));
}

export const addTokenToRequest = (authToken: string | null, request: RequestInit): RequestInit => {
	if (isNotNull(authToken)) {
		request.headers = {
			...request.headers,
			Authorization: `Bearer ${authToken}`,
		}
	}
	return request;
}

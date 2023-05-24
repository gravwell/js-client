/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isArray, isUndefined } from 'lodash';
import { QueryParams, URLParams } from './http-request-options';

export type URLProtocol = 'http' | 'ws';
const SECURE_PROTOCOLS: Record<URLProtocol, string> = {
	http: 'https',
	ws: 'wss',
};

export interface URLOptions {
	protocol: URLProtocol;
	useEncryption: boolean;
	host: string;
	pathParams?: URLParams;
	queryParams?: QueryParams;
}

export const buildURL = (templatePath: string, base: URLOptions, overwrites: Partial<URLOptions> = {}): string => {
	const pathParams = {
		...(base.pathParams ?? {}),
		...(overwrites.pathParams ?? {}),
	};
	const queryParams = {
		...(base.queryParams ?? {}),
		...(overwrites.queryParams ?? {}),
	};
	const useEncryption = overwrites.useEncryption ?? base.useEncryption;
	const protocol = useEncryption
		? SECURE_PROTOCOLS[overwrites.protocol ?? base.protocol]
		: overwrites.protocol ?? base.protocol;

	const hostString = (overwrites.host ?? base.host).valueOf();
	const path = applyPathParams(templatePath, pathParams) + toQueryString(queryParams);
	return `${protocol}://${hostString}${path}`;
};

const applyPathParams = (templatePath: string, pathParams: URLParams): string =>
	Object.entries(pathParams)
		.map(([key, value]) => ({ key, value }))
		.reduce((acc, { key, value }) => acc.replace(`{${key}}`, value), templatePath);

const toQueryString = (params: QueryParams): string => {
	const values = Object.entries(params)
		.map(([key, value]) => ({ key, value }))
		.reduce((acc, { key, value }) => {
			const valuesArray = isArray(value) ? value : [value];
			const definedValues = valuesArray.filter((v): v is NonNullable<typeof v> => !isUndefined(v));
			const formattedValues = definedValues.map(v => ({ key, value: v }));
			return acc.concat(formattedValues);
		}, [] as Array<{ key: string; value: string | boolean | number }>)
		.map(({ key, value }) => `${key}=${value.toString()}`)
		.join('&');
	return values === '' ? '' : '?' + values;
};

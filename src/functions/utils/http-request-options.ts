/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export interface HTTPRequestOptions {
	query?: QueryParams;
	headers?: { [key: string]: string | undefined };
	url?: URLParams;
	body?: string;
}

export type QueryParams = Record<string, undefined | string | boolean | number | Array<string | boolean | number>>;
export type URLParams = Record<string, string>;

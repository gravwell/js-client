/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {isEmpty, isString} from 'lodash';
import { Response } from './response';

type ResponseExpectation = 'void' | 'json' | 'text';

export const parseJSONResponse = async <T, Expect extends ResponseExpectation = 'json'>(
	raw: Response,
	options: { expect?: Expect; returnError?: boolean } = {},
): Promise<Expect extends 'void' ? void : Expect extends 'text' ? string : T> => {
	const expect: ResponseExpectation = options.expect ?? 'json';
	const returnError = options.returnError ?? false;

	try {
		const status = raw.status;
		const text = await raw.text();
		// console.log(`${status} ${raw.url}:  ${text}`);

		if (status >= 400 && returnError === false) {
			let error = createStatusError(status);
			try {
				const json = JSON.parse(text);
				const errorMessage = json?.Error ?? text;
				if (isString(errorMessage)) error = new Error(errorMessage);
			} catch (e) { // API may just return a string in the response
				if (!isEmpty(text.trim())) {
					error = new Error(text);
				}
			}
			throw error;
		}

		switch (expect) {
			case 'void': {
				return undefined as any;
			}
			case 'text': {
				return text as any;
			}
			case 'json': {
				try {
					const json = JSON.parse(text);
					return json;
				} catch {
					// Error parsing JSON means that the body was just a regular text describing the reason for failure
					throw Error(text);
				}
			}
		}
	} catch (err) {
		if (err instanceof Error) throw err;
		throw Error('Unknown error');
	}
};

const createStatusError = (status: number): Error =>
	new Error(
		((): string => {
			switch (status) {
				case 400:
					return 'Bad request';
				case 401:
					return 'Unauthorized';
				case 403:
					return 'Forbidden';
				case 404:
					return 'Not found';
				case 500:
					return 'Internal server error';
				default:
					return `Unexpected HTTP error ${status}`;
			}
		})(),
	);

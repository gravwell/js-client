/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isRegExp, takeRightWhile, uniq } from 'lodash';

export type Regex = RegExp;

export type RawRegex = string;

export const toRegex = (raw: RawRegex, defaultFlags: Array<string> = []): Regex => {
	// If it doesn't start with a "/"", then it's a regular string
	// If it has less than two "/", then it's also a regular string
	if (!raw.startsWith('/') || Array.from(raw).filter(c => c === '/').length < 2) {
		return new RegExp(raw, defaultFlags.join(''));
	}

	const flags = uniq(takeRightWhile(raw, char => char !== '/').concat(defaultFlags)).join('');
	const source = raw.substr(1, raw.length - (flags.length + 2));
	return new RegExp(source, flags);
};

export const toRawRegex = (regex: Regex): RawRegex => {
	const { source, flags } = regex;
	return `/${source}/${flags}`;
};

export const isRegex = (value: any): value is Regex => isRegExp(value);

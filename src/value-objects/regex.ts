/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isRegExp, takeRightWhile } from 'lodash';

export type Regex = RegExp;

export type RawRegex = string;

export const toRegex = (raw: RawRegex): Regex => {
	const flags = takeRightWhile(raw, char => char !== '/').join('');
	const source = raw.substr(1, raw.length - (flags.length + 2));
	return new RegExp(source, flags);
};

export const toRawRegex = (regex: Regex): RawRegex => {
	const { source, flags } = regex;
	return `/${source}/${flags}`;
};

export const isRegex = (value: any): value is Regex => isRegExp(value);

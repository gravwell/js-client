/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isInteger, isNumber, isString } from 'lodash';

/**
 * @examples
 * ```ts
 * '3.5.7'
 * '3'
 * '1.5'
 * ```
 */
export type RawVersion = string;

export type RawVersionObject = {
	Major: number;
	Minor?: number;
	Point?: number;
};

export interface Version {
	major: number;
	minor: number;
	patch: number;
}

export const isVersion = (value: any): value is Version => {
	try {
		const v = <Version>value;
		return isInteger(v.major) && isInteger(v.minor) && isInteger(v.patch);
	} catch {
		return false;
	}
};

export const toVersion = (raw: RawVersion | RawVersionObject | number): Version => {
	if (isString(raw) || isNumber(raw)) {
		const [major, minor, patch] = raw
			.toString()
			.split('.')
			.map(s => parseInt(s, 10))
			.concat([0, 0, 0]);
		return { major, minor, patch };
	} else {
		return { major: raw.Major, minor: raw.Minor ?? 0, patch: raw.Point ?? 0 };
	}
};

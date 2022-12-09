/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isString } from 'lodash';

const TIMESTAMP_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2}[T][0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]{1,9}[Z]|[Z])/;

export const isTimestamp = (value: unknown): boolean => {
	try {
		return isString(value) && TIMESTAMP_REGEX.test(value);
	} catch {
		return false;
	}
};

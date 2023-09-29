/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNil } from 'lodash';

export const assertIsNotNil: <T>(value: T) => asserts value is Exclude<T, null | undefined> = value => {
	if (isNil(value)) {
		throw new Error('Valus is nil');
	}
};

export const assertNoneNil: <T>(value: Array<T>) => asserts value is Array<Exclude<T, null | undefined>> = value => {
	value.forEach(v => {
		if (isNil(v)) {
			throw new Error('Valus is nil');
		}
	});
};

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Decoder, dict, guard, number } from 'decoders';

/** Given a Decoder<T>, returns a type guard that returns true if value v is of type T */
export const mkTypeGuard = <T>(d: Decoder<T>) => {
	const g = guard(d);
	return (v: unknown): v is T => {
		try {
			g(v);
			return true;
		} catch {
			return false;
		}
	};
};

/** A type guard that returns true if the input parameter is a {[key: string]: number} */
export const isDictOfNumber = mkTypeGuard(dict(number));

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export {};

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toPartiallyEqual(expected: any, expectationFailOutput?: any): boolean;
		}
	}
}

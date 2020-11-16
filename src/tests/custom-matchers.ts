/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { matches } from 'lodash';

export const myCustomMatchers: jasmine.CustomMatcherFactories = {
	toPartiallyEqual: () => ({
		compare: (actual: any, expected: any) => {
			const pass = matches(expected)(actual);
			const result: jasmine.CustomMatcherResult = { pass };

			if (pass == false) {
				const serialize = (v: any): string => JSON.stringify(v, null, '  ');
				result.message = `Expected ${serialize(actual)} to partially equal ${serialize(expected)}`;
			}

			return result;
		},
	}),
};

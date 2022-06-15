/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRegex } from './regex';

describe(toRegex.name, () => {
	const cases: Array<[string, RegExp]> = [
		['/pattern/g', /pattern/g],
		['pattern', /pattern/],
		['/pattern', /\/pattern/],
	];
	for (const [input, expected] of cases) {
		it(`should convert "${input}" to a regex`, () => {
			const actual = toRegex(input);
			expect(actual).toEqual(expected);
		});
	}
});

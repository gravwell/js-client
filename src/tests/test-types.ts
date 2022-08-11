/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TEST_TYPES, TestType } from './config';

// from Jasmine
type ImplementationCallback = (() => PromiseLike<any>) | (() => void);

const makeRequireTestType =
	(testType: TestType, skipReason: string) =>
	(assertion: ImplementationCallback): ImplementationCallback =>
	() =>
		TEST_TYPES.then(types => {
			if (!types.includes(testType)) {
				return pending(skipReason);
			} else {
				return assertion();
			}
		});

export const integrationTest: (f: ImplementationCallback) => ImplementationCallback = makeRequireTestType(
	'integration',
	`Skipped because $INTEGRATION_TESTS is false`,
);
export const unitTest: (f: ImplementationCallback) => ImplementationCallback = makeRequireTestType(
	'unit',
	`Skipped because $UNIT_TESTS is false`,
);

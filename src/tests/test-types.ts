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
	(assertion: ImplementationCallback): ImplementationCallback => {
		if (!TEST_TYPES.includes(testType)) {
			return () => pending(skipReason);
		} else {
			return assertion;
		}
	};

export const integrationTest: (f: ImplementationCallback) => ImplementationCallback = makeRequireTestType(
	'integration',
	`Skipped because $INTEGRATION_TESTS is false`,
);
export const unitTest: (f: ImplementationCallback) => ImplementationCallback = makeRequireTestType(
	'unit',
	`Skipped because $UNIT_TESTS is false`,
);

const makeRequireTestTypeDescribe =
	(testType: TestType, skipReason: string) =>
	(specDefinitions: () => void): (() => void) => {
		if (!TEST_TYPES.includes(testType)) {
			// return an xit since Jasmine gets angry about describe()'s with no tests
			return () =>
				xit(skipReason, () => {
					console.log('skipped');
				});
		} else {
			return specDefinitions;
		}
	};

export const integrationTestSpecDef: (f: () => void) => () => void = makeRequireTestTypeDescribe(
	'integration',
	`Skipped because $INTEGRATION_TESTS is false`,
);
export const unitTestSpecDef: (f: () => void) => () => void = makeRequireTestTypeDescribe(
	'unit',
	`Skipped because $UNIT_TESTS is false`,
);

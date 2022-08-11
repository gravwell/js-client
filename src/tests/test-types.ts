/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { TEST_TYPES, TestType } from './config';

// from Jasmine
type ImplementationCallback = (() => PromiseLike<any>) | (() => void) | ((done: DoneFn) => void);

const makeRequireTestType =
	(testType: TestType, skipReason: string) =>
	(assertion: ImplementationCallback): (() => PromiseLike<any>) =>
	async () => {
		const skip = !(await TEST_TYPES).includes(testType);
		return skip ? () => pending(skipReason) : assertion;
	};

export const integrationTest = makeRequireTestType('integration', `Skipped because $INTEGRATION_TESTS is false`);
export const unitTest = makeRequireTestType('unit', `Skipped because $UNIT_TESTS is false`);

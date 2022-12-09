/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { firstValueFrom, from, ReplaySubject } from 'rxjs';
import { APIContext } from '~/functions/utils';
import { getTestContext, getTestTypes } from './get-runner-settings';

export * from './paths';

const textContext: ReplaySubject<APIContext> = new ReplaySubject(1);

from(getTestContext()).subscribe(textContext);

export const TEST_BASE_API_CONTEXT = (): Promise<APIContext> => firstValueFrom(textContext);

export type TestType = 'unit' | 'integration';
export const TEST_TYPES = ((): Array<TestType> => {
	const s = getTestTypes();
	const testTypes: Array<TestType> = [];
	if (s.unitTests) {
		testTypes.push('unit');
	}
	if (s.integrationTests) {
		testTypes.push('integration');
	}
	return testTypes;
})();

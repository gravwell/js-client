/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { firstValueFrom, from, map, ReplaySubject } from 'rxjs';
import { APIContext } from '~/functions/utils';
import { getRunnerSettings } from './get-runner-settings';

export * from './paths';

const settings$: ReplaySubject<{
	context: APIContext;
	unitTests: boolean;
	integrationTests: boolean;
}> = new ReplaySubject(1);

from(getRunnerSettings()).subscribe(settings$);

export const TEST_BASE_API_CONTEXT = (): Promise<APIContext> => firstValueFrom(settings$.pipe(map(s => s.context)));

export type TestType = 'unit' | 'integration';
export const TEST_TYPES = (async (): Promise<Array<TestType>> => {
	const s = await firstValueFrom(settings$);
	const testTypes: Array<TestType> = [];
	if (s.unitTests) {
		testTypes.push('unit');
	}
	if (s.integrationTests) {
		testTypes.push('integration');
	}
	return testTypes;
})();

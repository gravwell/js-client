/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { getEnvVar } from './get-env-var';

export * from './paths';

export const TEST_HOST = getEnvVar('TEST_HOST') ?? 'localhost:8080';

export const TEST_AUTH_TOKEN = getEnvVar('TEST_AUTH_TOKEN') ?? null;

const getBooleanEnv = (envVar: string): boolean | null => {
	const envValue = getEnvVar(envVar);
	if (envValue === undefined) return null;
	const validValues = ['true', 'false'];
	if (!validValues.includes(envValue)) throw Error(`Environment variable $${envVar}="${envValue}" should be a boolean`);
	return envValue === 'true';
};

export type TestType = 'unit' | 'integration';
export const TEST_TYPES = ((): Array<TestType> => {
	const integrationTestsEnv = getBooleanEnv('INTEGRATION_TESTS') ?? false;
	const unitTestsEnv = getBooleanEnv('UNIT_TESTS') ?? true;

	const testTypes: Array<TestType> = [];
	if (unitTestsEnv) testTypes.push('unit');
	if (integrationTestsEnv) testTypes.push('integration');
	return testTypes;
})();

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import * as dotenv from 'dotenv';
import { isNil, isString } from 'lodash';
import { URL } from 'node:url';
import { APIContext } from '../functions/utils/api-context';
import { fetch } from '../functions/utils/fetch';

dotenv.config();

const getBooleanEnv = (envVar: string): boolean | null => {
	const envValue = process.env[envVar];
	if (envValue === undefined) {
		return null;
	}
	const validValues = ['true', 'false'];
	if (!validValues.includes(envValue)) {
		throw Error(`Environment variable $${envVar}="${envValue}" should be a boolean`);
	}
	return envValue === 'true';
};

export const getTestHostUrl = (): URL => {
	const val = process.env['TEST_HOST'];

	if (isNil(val)) {
		throw new Error('TEST_HOST value is missing. Exiting now.');
	}

	try {
		return new URL(val);
	} catch (e) {
		throw new Error('Could not parse TEST_HOST as a URL. Ensure it is absolute (e.g., http://localhost:8080)');
	}
};

const integrationTestsEnv = getBooleanEnv('INTEGRATION_TESTS') ?? false;
const unitTestsEnv = getBooleanEnv('UNIT_TESTS') ?? true;

const getAuthToken = (): Promise<string> => {
	const url = getTestHostUrl();
	url.pathname = '/api/login';

	return fetch(url.toString(), {
		method: 'POST',
		headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
		body: JSON.stringify({ User: 'admin', Pass: 'changeme' }),
	})
		.then(response => response.json())
		.then((response): string => {
			const jwt = response.JWT;
			if (isString(jwt)) {
				console.log('Successfully fetched API Token');
				return jwt;
			}
			throw new Error('Could not find JWT. Exiting.');
		});
};

export const getTestTypes = (): {
	unitTests: boolean;
	integrationTests: boolean;
} => {
	console.log('Using Node settings for JS Client test types');
	return {
		unitTests: unitTestsEnv,
		integrationTests: integrationTestsEnv,
	};
};

export const getTestContext = async (): Promise<APIContext> => {
	console.log('Using Node settings for JS Client test context');

	const url = getTestHostUrl();

	const host = integrationTestsEnv ? url.host : '';
	const useEncryption = integrationTestsEnv && url.protocol === 'https';
	const authToken = integrationTestsEnv ? await getAuthToken() : null;
	return { host, useEncryption, authToken, fetch };
};

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isValidSearch, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetMyUser, makeGetOneUser } from '../users';
import { makeGetSearchHistory } from './get-search-history';

describe('getSearchHistory()', () => {
	const getSearchHistory = makeGetSearchHistory({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getMyUser = makeGetMyUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	let admin: User;
	let user: User;
	let userAuth: string;

	beforeEach(async () => {
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		const userID = await createOneUser(data);
		user = await getOneUser(userID);
		userAuth = await login(user.username, data.password);

		admin = await getMyUser();
	});

	it(
		'Should get the search history of a specific user',
		integrationTest(async () => {
			const searches = await getSearchHistory({ target: 'user', userID: '1' });
			expect(searches.every(isValidSearch)).toBeTrue();
		}),
	);

	it(
		'Should get the search history of a specific group',
		integrationTest(async () => {
			const searches = await getSearchHistory({ target: 'group', groupID: '1' });
			expect(searches.every(isValidSearch)).toBeTrue();
		}),
	);

	it(
		'Should get the search history related to a specific user',
		integrationTest(async () => {
			const searches = await getSearchHistory({ target: 'user related', userID: '1' });
			expect(searches.every(isValidSearch)).toBeTrue();
		}),
	);

	it(
		'Should get the search history of all users',
		integrationTest(async () => {
			const searches = await getSearchHistory({ target: 'all' });
			expect(searches.every(isValidSearch)).toBeTrue();
		}),
	);

	it(
		'Should get my search history',
		integrationTest(async () => {
			const searches = await getSearchHistory({ target: 'myself' });
			expect(searches.every(isValidSearch)).toBeTrue();
		}),
	);

	it(
		'Should not get the search history of another user if the request was not from an admin',
		integrationTest(async () => {
			const getSearchHistoryAsAnalyst = makeGetSearchHistory({
				host: TEST_HOST,
				useEncryption: false,
				authToken: userAuth,
			});

			await expectAsync(getSearchHistoryAsAnalyst({ target: 'user', userID: admin.id })).toBeRejected();
		}),
	);
});

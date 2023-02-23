/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { CreatableUser, isValidSearch, User } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetMyUser } from '../users';
import { makeGetSearchHistory } from './get-search-history';

describe(
	'getSearchHistory()',
	integrationTestSpecDef(() => {
		let getSearchHistory: ReturnType<typeof makeGetSearchHistory>;
		beforeAll(async () => {
			getSearchHistory = makeGetSearchHistory(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let getMyUser: ReturnType<typeof makeGetMyUser>;
		beforeAll(async () => {
			getMyUser = makeGetMyUser(await TEST_BASE_API_CONTEXT());
		});

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
				username: userSeed,
			};
			user = await createOneUser(data);
			userAuth = await login(user.username, data.password);

			admin = await getMyUser();
		});

		xit(
			'Should get the search history of a specific user',
			integrationTest(async () => {
				const searches = await getSearchHistory({ target: 'user', userID: '1' });
				expect(searches.every(isValidSearch)).toBeTrue();
			}),
		);

		xit(
			'Should get the search history of a specific group',
			integrationTest(async () => {
				const searches = await getSearchHistory({ target: 'group', groupID: '1' });
				expect(searches.every(isValidSearch)).toBeTrue();
			}),
		);

		xit(
			'Should get the search history related to a specific user',
			integrationTest(async () => {
				const searches = await getSearchHistory({ target: 'user related', userID: '1' });
				expect(searches.every(isValidSearch)).toBeTrue();
			}),
		);

		xit(
			'Should get the search history of all users',
			integrationTest(async () => {
				const searches = await getSearchHistory({ target: 'all' });
				expect(searches.every(isValidSearch)).toBeTrue();
			}),
		);

		xit(
			'Should get my search history',
			integrationTest(async () => {
				const searches = await getSearchHistory({ target: 'myself' });
				expect(searches.every(isValidSearch)).toBeTrue();
			}),
		);

		xit(
			'Should not get the search history of another user if the request was not from an admin',
			integrationTest(async () => {
				const getSearchHistoryAsAnalyst = makeGetSearchHistory({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: userAuth,
				});

				await expectAsync(getSearchHistoryAsAnalyst({ target: 'user', userID: admin.id })).toBeRejected();
			}),
		);
	}),
);

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { CreatableSavedQuery, CreatableUser, isSavedQuery, SavedQuery, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeGetSavedQueriesAuthorizedToMe } from './get-saved-queries-authorized-to-me';

describe('getSavedQueriesAuthorizedToMe()', () => {
	const getSavedQueriesAuthorizedToMe = makeGetSavedQueriesAuthorizedToMe({ host: TEST_HOST, useEncryption: false });
	const createOneSavedQuery = makeCreateOneSavedQuery({ host: TEST_HOST, useEncryption: false });
	const deleteOneSavedQuery = makeDeleteOneSavedQuery({ host: TEST_HOST, useEncryption: false });
	const getAllSavedQueries = makeGetAllSavedQueries({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false });

	let adminSavedQueries: Array<SavedQuery>;

	let analyst: User;
	let analystAuth: string;
	let analystSavedQueries: Array<SavedQuery>;

	beforeEach(async () => {
		// Delete all saved queries
		const currentSavedQueries = await getAllSavedQueries(TEST_AUTH_TOKEN);
		const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
		const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(TEST_AUTH_TOKEN, savedQueryID));
		await Promise.all(deletePromises);

		// Create two saved queries as admin
		const creatableSavedQueries: Array<CreatableSavedQuery> = [
			{
				name: 'Q1',
				query: 'tag=netflow',
			},
			{
				name: 'Q2',
				query: 'tag=custom-test',
			},
		];
		const createPromises = creatableSavedQueries.map(creatable => createOneSavedQuery(TEST_AUTH_TOKEN, creatable));
		adminSavedQueries = await Promise.all(createPromises);

		// Creates an analyst
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		const userID = await createOneUser(TEST_AUTH_TOKEN, data);
		analyst = await getOneUser(TEST_AUTH_TOKEN, userID);
		analystAuth = await login(analyst.username, data.password);

		// Create three saved queries as analyst
		const creatableSavedQueries2: Array<CreatableSavedQuery> = [
			{
				name: 'Q3',
				query: 'tag=idk',
			},
			{
				name: 'Q4',
				query: 'tag=test',
			},
			{
				name: 'Q5',
				query: 'tag=default',
			},
		];
		const createPromises2 = creatableSavedQueries2.map(creatable => createOneSavedQuery(analystAuth, creatable));
		analystSavedQueries = await Promise.all(createPromises2);
	});

	it(
		'Returns all my saved queries',
		integrationTest(async () => {
			const actualAdminSavedQueries = await getSavedQueriesAuthorizedToMe(TEST_AUTH_TOKEN);
			expect(sortBy(actualAdminSavedQueries, m => m.id)).toEqual(sortBy(adminSavedQueries, m => m.id));
			for (const savedQuery of actualAdminSavedQueries) expect(isSavedQuery(savedQuery)).toBeTrue();

			const actualAnalystSavedQueries = await getSavedQueriesAuthorizedToMe(analystAuth);
			expect(sortBy(actualAnalystSavedQueries, m => m.id)).toEqual(sortBy(analystSavedQueries, m => m.id));
			for (const savedQuery of actualAnalystSavedQueries) expect(isSavedQuery(savedQuery)).toBeTrue();

			const allSavedQueries = await getAllSavedQueries(TEST_AUTH_TOKEN);
			expect(sortBy(allSavedQueries, m => m.id)).toEqual(
				sortBy([...analystSavedQueries, ...adminSavedQueries], m => m.id),
			);
			for (const savedQuery of allSavedQueries) expect(isSavedQuery(savedQuery)).toBeTrue();
		}),
	);
});

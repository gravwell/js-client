/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { CreatableSavedQuery, CreatableUser, isSavedQuery, SavedQuery, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users';
import { makeCreateOneSavedQuery } from './create-one-saved-query';
import { makeDeleteOneSavedQuery } from './delete-one-saved-query';
import { makeGetAllSavedQueries } from './get-all-saved-queries';
import { makeGetSavedQueriesAuthorizedToMe } from './get-saved-queries-authorized-to-me';

describe('getSavedQueriesAuthorizedToMe()', () => {
	const getSavedQueriesAuthorizedToMe = makeGetSavedQueriesAuthorizedToMe(TEST_BASE_API_CONTEXT);
	const createOneSavedQuery = makeCreateOneSavedQuery(TEST_BASE_API_CONTEXT);
	const deleteOneSavedQuery = makeDeleteOneSavedQuery(TEST_BASE_API_CONTEXT);
	const getAllSavedQueries = makeGetAllSavedQueries(TEST_BASE_API_CONTEXT);
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);

	let adminSavedQueries: Array<SavedQuery>;

	let analyst: User;
	let analystAuth: string;
	let analystSavedQueries: Array<SavedQuery>;

	beforeEach(async () => {
		// Delete all saved queries
		const currentSavedQueries = await getAllSavedQueries();
		const currentSavedQueryIDs = currentSavedQueries.map(m => m.id);
		const deletePromises = currentSavedQueryIDs.map(savedQueryID => deleteOneSavedQuery(savedQueryID));
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
		const createPromises = creatableSavedQueries.map(creatable => createOneSavedQuery(creatable));
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
		analyst = await createOneUser(data);
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

		const createOneSavedQueryAsAnalyst = makeCreateOneSavedQuery({
			...TEST_BASE_API_CONTEXT,
			authToken: analystAuth,
		});

		const createPromises2 = creatableSavedQueries2.map(creatable => createOneSavedQueryAsAnalyst(creatable));
		analystSavedQueries = await Promise.all(createPromises2);
	});

	xit(
		'Returns all my saved queries',
		integrationTest(async () => {
			const actualAdminSavedQueries = await getSavedQueriesAuthorizedToMe();
			expect(sortBy(actualAdminSavedQueries, m => m.id)).toEqual(sortBy(adminSavedQueries, m => m.id));
			for (const savedQuery of actualAdminSavedQueries) expect(isSavedQuery(savedQuery)).toBeTrue();

			const getSavedQueriesAuthorizedToAnalyst = makeGetSavedQueriesAuthorizedToMe({
				...TEST_BASE_API_CONTEXT,
				authToken: analystAuth,
			});

			const actualAnalystSavedQueries = await getSavedQueriesAuthorizedToAnalyst();
			expect(sortBy(actualAnalystSavedQueries, m => m.id)).toEqual(sortBy(analystSavedQueries, m => m.id));
			for (const savedQuery of actualAnalystSavedQueries) expect(isSavedQuery(savedQuery)).toBeTrue();

			const allSavedQueries = await getAllSavedQueries();
			expect(sortBy(allSavedQueries, m => m.id)).toEqual(
				sortBy([...analystSavedQueries, ...adminSavedQueries], m => m.id),
			);
			for (const savedQuery of allSavedQueries) expect(isSavedQuery(savedQuery)).toBeTrue();
		}),
	);
});

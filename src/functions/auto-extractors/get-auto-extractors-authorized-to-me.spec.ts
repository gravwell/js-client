/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random, sortBy } from 'lodash';
import { AutoExtractor, CreatableAutoExtractor, CreatableUser, isAutoExtractor, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser, makeGetOneUser } from '../users';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeGetAutoExtractorsAuthorizedToMe } from './get-auto-extractors-authorized-to-me';

describe('getAutoExtractorsAuthorizedToMe()', () => {
	const getAutoExtractorsAuthorizedToMe = makeGetAutoExtractorsAuthorizedToMe({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneAutoExtractor = makeCreateOneAutoExtractor({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const deleteOneAutoExtractor = makeDeleteOneAutoExtractor({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getAllAutoExtractors = makeGetAllAutoExtractors({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	let adminAutoExtractors: Array<AutoExtractor>;

	let analyst: User;
	let analystAuth: string;
	let analystAutoExtractors: Array<AutoExtractor>;

	beforeEach(async () => {
		// Delete all auto extractors
		const currentAutoExtractors = await getAllAutoExtractors();
		const currentAutoExtractorIDs = currentAutoExtractors.map(m => m.id);
		const deletePromises = currentAutoExtractorIDs.map(autoExtractorID => deleteOneAutoExtractor(autoExtractorID));
		await Promise.all(deletePromises);

		// Create two auto extractors as admin
		const creatableAutoExtractors: Array<CreatableAutoExtractor> = [
			{
				name: 'AE1 name',
				description: 'AE1 description',

				tag: 'netflow',
				module: 'csv',
				parameters: 'a b c',
			},
			{
				name: 'AE2 name',
				description: 'AE2 description',

				tag: 'gravwell',
				module: 'fields',
				parameters: '1 2 3',
			},
		];
		const createPromises = creatableAutoExtractors.map(creatable => createOneAutoExtractor(creatable));
		adminAutoExtractors = await Promise.all(createPromises);

		// Creates an analyst
		const userSeed = random(0, Number.MAX_SAFE_INTEGER).toString();
		const data: CreatableUser = {
			name: 'Test',
			email: userSeed + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: userSeed,
		};
		const userID = await createOneUser(data);
		analyst = await getOneUser(userID);
		analystAuth = await login(analyst.username, data.password);

		// Create three autoExtractors as analyst
		const creatableAutoExtractors2: Array<CreatableAutoExtractor> = [
			{
				name: 'AE3 name',
				description: 'AE3 description',

				tag: 'gravwell',
				module: 'fields',
				parameters: '1 2 3',
			},
			{
				name: 'AE4 name',
				description: 'AE4 description',

				tag: 'gravwell',
				module: 'fields',
				parameters: '1 2 3',
			},
			{
				name: 'AE5 name',
				description: 'AE5 description',

				tag: 'gravwell',
				module: 'fields',
				parameters: '1 2 3',
			},
		];
		const createPromises2 = creatableAutoExtractors2.map(creatable => createOneAutoExtractor(analystAuth, creatable));
		analystAutoExtractors = await Promise.all(createPromises2);
	});

	it(
		'Returns all my auto extractors',
		integrationTest(async () => {
			const actualAdminAutoExtractors = await getAutoExtractorsAuthorizedToMe();
			expect(sortBy(actualAdminAutoExtractors, m => m.id)).toEqual(sortBy(adminAutoExtractors, m => m.id));
			for (const autoExtractor of actualAdminAutoExtractors) expect(isAutoExtractor(autoExtractor)).toBeTrue();

			const actualAnalystAutoExtractors = await getAutoExtractorsAuthorizedToMe(analystAuth);
			expect(sortBy(actualAnalystAutoExtractors, m => m.id)).toEqual(sortBy(analystAutoExtractors, m => m.id));
			for (const autoExtractor of actualAnalystAutoExtractors) expect(isAutoExtractor(autoExtractor)).toBeTrue();

			const allAutoExtractors = await getAllAutoExtractors();
			expect(sortBy(allAutoExtractors, m => m.id)).toEqual(
				sortBy([...analystAutoExtractors, ...adminAutoExtractors], m => m.id),
			);
			for (const autoExtractor of allAutoExtractors) expect(isAutoExtractor(autoExtractor)).toBeTrue();
		}),
	);
});

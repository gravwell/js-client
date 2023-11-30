/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random, sortBy } from 'lodash';
import { CreatableUser, User } from '~/models';
import { AutoExtractor } from '~/models/auto-extractor/auto-extractor';
import { CreatableAutoExtractor } from '~/models/auto-extractor/creatable-auto-extractor';
import { isAutoExtractor } from '~/models/auto-extractor/is-auto-extractor';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from '../users/create-one-user';
import { makeCreateOneAutoExtractor } from './create-one-auto-extractor';
import { makeDeleteOneAutoExtractor } from './delete-one-auto-extractor';
import { makeGetAllAutoExtractors } from './get-all-auto-extractors';
import { makeGetAutoExtractorsAuthorizedToMe } from './get-auto-extractors-authorized-to-me';

describe(
	'getAutoExtractorsAuthorizedToMe()',
	integrationTestSpecDef(() => {
		let getAutoExtractorsAuthorizedToMe: ReturnType<typeof makeGetAutoExtractorsAuthorizedToMe>;
		beforeAll(async () => {
			getAutoExtractorsAuthorizedToMe = makeGetAutoExtractorsAuthorizedToMe(await TEST_BASE_API_CONTEXT());
		});
		let createOneAutoExtractor: ReturnType<typeof makeCreateOneAutoExtractor>;
		beforeAll(async () => {
			createOneAutoExtractor = makeCreateOneAutoExtractor(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneAutoExtractor: ReturnType<typeof makeDeleteOneAutoExtractor>;
		beforeAll(async () => {
			deleteOneAutoExtractor = makeDeleteOneAutoExtractor(await TEST_BASE_API_CONTEXT());
		});
		let getAllAutoExtractors: ReturnType<typeof makeGetAllAutoExtractors>;
		beforeAll(async () => {
			getAllAutoExtractors = makeGetAllAutoExtractors(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});

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
				username: userSeed,
			};
			analyst = await createOneUser(data);
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

			const createOneAutoExtractorAsAnalyst = makeCreateOneAutoExtractor({
				...(await TEST_BASE_API_CONTEXT()),
				authToken: analystAuth,
			});

			const createPromises2 = creatableAutoExtractors2.map(creatable => createOneAutoExtractorAsAnalyst(creatable));
			analystAutoExtractors = await Promise.all(createPromises2);
		});

		xit(
			'Returns all my auto extractors',
			integrationTest(async () => {
				const actualAdminAutoExtractors = await getAutoExtractorsAuthorizedToMe();
				expect(sortBy(actualAdminAutoExtractors, m => m.id)).toEqual(sortBy(adminAutoExtractors, m => m.id));
				for (const autoExtractor of actualAdminAutoExtractors) {
					expect(isAutoExtractor(autoExtractor)).toBeTrue();
				}

				const getAutoExtractorsAuthorizedToAnalyst = makeGetAutoExtractorsAuthorizedToMe({
					...(await TEST_BASE_API_CONTEXT()),
					authToken: analystAuth,
				});

				const actualAnalystAutoExtractors = await getAutoExtractorsAuthorizedToAnalyst();
				expect(sortBy(actualAnalystAutoExtractors, m => m.id)).toEqual(sortBy(analystAutoExtractors, m => m.id));
				for (const autoExtractor of actualAnalystAutoExtractors) {
					expect(isAutoExtractor(autoExtractor)).toBeTrue();
				}

				const allAutoExtractors = await getAllAutoExtractors();
				expect(sortBy(allAutoExtractors, m => m.id)).toEqual(
					sortBy([...analystAutoExtractors, ...adminAutoExtractors], m => m.id),
				);
				for (const autoExtractor of allAutoExtractors) {
					expect(isAutoExtractor(autoExtractor)).toBeTrue();
				}
			}),
		);
	}),
);

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isValidUser, User } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';
import { makeGetMyUser } from './get-my-user';
import { makeGetOneUser } from './get-one-user';
import { makeUpdateOneUser } from './update-one-user';

describe('updateOneUser()', () => {
	const updateOneUser = makeUpdateOneUser(TEST_BASE_API_CONTEXT);
	const getOneUser = makeGetOneUser(TEST_BASE_API_CONTEXT);
	const deleteOneUser = makeDeleteOneUser(TEST_BASE_API_CONTEXT);
	const createOneUser = makeCreateOneUser(TEST_BASE_API_CONTEXT);
	const getMyUser = makeGetMyUser(TEST_BASE_API_CONTEXT);
	const login = makeLoginOneUser(TEST_BASE_API_CONTEXT);

	let user: User;

	beforeEach(async () => {
		const username = 'test-user-' + random(0, Number.MAX_SAFE_INTEGER);
		const data: CreatableUser = {
			name: 'Test',
			email: username + '@example.com',
			password: 'changeme',
			role: 'analyst',
			user: username,
		};
		user = await createOneUser(data);
	});

	afterEach(async () => {
		await deleteOneUser(user.id);
	});

	it(
		"Should update the user's username",
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();

			const newUsername = 'new-username-' + random(0, Number.MAX_SAFE_INTEGER);
			expect(newUsername).not.toBe(user.username);

			await updateOneUser({ id: user.id, username: newUsername });
			const updatedUser = await getOneUser(user.id);
			expect(updatedUser.username).toBe(newUsername);
			expect(isValidUser(updatedUser)).toBeTrue();
		}),
	);

	it(
		'Should update the user email',
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();

			const newEmail = 'new-email-' + random(0, Number.MAX_SAFE_INTEGER) + '@example.com';
			expect(newEmail).not.toBe(user.email);

			await updateOneUser({ id: user.id, email: newEmail });
			const updatedUser = await getOneUser(user.id);
			expect(updatedUser.email).toBe(newEmail);
			expect(isValidUser(updatedUser)).toBeTrue();
		}),
	);

	it(
		'Should update the user name',
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();

			const newName = 'new-name-' + random(0, Number.MAX_SAFE_INTEGER);
			expect(newName).not.toBe(user.name);

			await updateOneUser({ id: user.id, name: newName });
			const updatedUser = await getOneUser(user.id);
			expect(updatedUser.name).toBe(newName);
			expect(isValidUser(updatedUser)).toBeTrue();
		}),
	);

	it(
		'Should update the user locked state',
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();
			expect(user.locked).toBeFalse();

			await updateOneUser({ id: user.id, locked: true });
			const lockedUser = await getOneUser(user.id);
			expect(lockedUser.locked).toBeTrue();
			expect(isValidUser(lockedUser)).toBeTrue();

			await updateOneUser({ id: user.id, locked: false });
			const unlockedUser = await getOneUser(user.id);
			expect(unlockedUser.locked).toBeFalse();
			expect(isValidUser(unlockedUser)).toBeTrue();
		}),
	);

	it(
		'Should update the user role',
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();
			expect(user.role).toBe('analyst');

			await updateOneUser({ id: user.id, role: 'admin' });
			const updatedUser1 = await getOneUser(user.id);
			expect(updatedUser1.role).toBe('admin');
			expect(isValidUser(updatedUser1)).toBeTrue();

			await updateOneUser({ id: user.id, role: 'analyst' });
			const updatedUser2 = await getOneUser(user.id);
			expect(updatedUser2.role).toBe('analyst');
			expect(isValidUser(updatedUser2)).toBeTrue();
		}),
	);

	it(
		'Should update my password, requiring the current one',
		integrationTest(async () => {
			const myUser = await getMyUser();
			expect(isValidUser(myUser)).toBeTrue();

			const currentPassword = 'changeme';
			const newPassword = 'changeme2';

			// Current password works
			await expectAsync(login(myUser.username, currentPassword)).toBeResolved();

			// Didn't updated the password
			await expectAsync(updateOneUser({ id: myUser.id, password: newPassword })).toBeRejected();

			// Current password still works
			await expectAsync(login(myUser.username, currentPassword)).toBeResolved();

			// Update the password
			await expectAsync(updateOneUser({ id: myUser.id, password: newPassword, currentPassword })).toBeResolved();

			// New password works
			await expectAsync(login(myUser.username, newPassword)).toBeResolved();

			// Teardown
			await expectAsync(
				updateOneUser({ id: myUser.id, password: currentPassword, currentPassword: newPassword }),
			).toBeResolved();
		}),
	);

	it(
		'Should update the user password without passing current one',
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();
			expect(user.role).toBe('analyst');

			const currentPassword = 'changeme';
			const newPassword = 'changeme2';

			// Current password works
			await expectAsync(login(user.username, currentPassword)).toBeResolved();

			// Update the password
			await expectAsync(updateOneUser({ id: user.id, password: newPassword })).toBeResolved();

			// New password works
			await expectAsync(login(user.username, newPassword)).toBeResolved();
		}),
	);

	it(
		'Should update the user search group ID',
		integrationTest(async () => {
			const newSearchGroupID = '1';
			expect(user.searchGroupID).not.toEqual(newSearchGroupID);

			await expectAsync(updateOneUser({ id: user.id, searchGroupID: newSearchGroupID })).toBeResolved();
			const updatedUser = await getOneUser(user.id);

			expect(updatedUser.searchGroupID).toEqual(newSearchGroupID);
			expect(isValidUser(updatedUser)).toBeTrue();
		}),
	);

	it(
		'Should update the user search group ID to null',
		integrationTest(async () => {
			// We need to update the user before because the createOneUser return the search id null by default and that would give us a false positive
			await expectAsync(updateOneUser({ id: user.id, searchGroupID: '1' })).toBeResolved();
			user = await getOneUser(user.id);

			const newSearchGroupID = null;
			expect(user.searchGroupID).not.toEqual(newSearchGroupID);

			await expectAsync(updateOneUser({ id: user.id, searchGroupID: newSearchGroupID })).toBeResolved();
			const updatedUser = await getOneUser(user.id);

			expect(updatedUser.searchGroupID).toEqual(newSearchGroupID);
			expect(isValidUser(updatedUser)).toBeTrue();
		}),
	);
});

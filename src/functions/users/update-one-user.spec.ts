/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { random } from 'lodash';
import { CreatableUser, isValidUser, User } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeLoginOneUser } from '../auth';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';
import { makeGetMyUser } from './get-my-user';
import { makeGetOneUser } from './get-one-user';
import { makeUpdateOneUser } from './update-one-user';

describe('updateOneUser()', () => {
	const updateOneUser = makeUpdateOneUser({ host: TEST_HOST, useEncryption: false });
	const getOneUser = makeGetOneUser({ host: TEST_HOST, useEncryption: false });
	const deleteOneUser = makeDeleteOneUser({ host: TEST_HOST, useEncryption: false });
	const createOneUser = makeCreateOneUser({ host: TEST_HOST, useEncryption: false });
	const getMyUser = makeGetMyUser({ host: TEST_HOST, useEncryption: false });
	const login = makeLoginOneUser({ host: TEST_HOST, useEncryption: false });

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
		const userID = await createOneUser(TEST_AUTH_TOKEN, data);
		user = await getOneUser(TEST_AUTH_TOKEN, userID);
	});

	afterEach(async () => {
		await deleteOneUser(TEST_AUTH_TOKEN, user.id);
	});

	it(
		"Should update the user's username",
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();

			const newUsername = 'new-username-' + random(0, Number.MAX_SAFE_INTEGER);
			expect(newUsername).not.toBe(user.username);

			await updateOneUser(TEST_AUTH_TOKEN, { id: user.id, username: newUsername });
			const updatedUser = await getOneUser(TEST_AUTH_TOKEN, user.id);
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

			await updateOneUser(TEST_AUTH_TOKEN, { id: user.id, email: newEmail });
			const updatedUser = await getOneUser(TEST_AUTH_TOKEN, user.id);
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

			await updateOneUser(TEST_AUTH_TOKEN, { id: user.id, name: newName });
			const updatedUser = await getOneUser(TEST_AUTH_TOKEN, user.id);
			expect(updatedUser.name).toBe(newName);
			expect(isValidUser(updatedUser)).toBeTrue();
		}),
	);

	it(
		'Should update the user locked state',
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();
			expect(user.locked).toBeFalse();

			await updateOneUser(TEST_AUTH_TOKEN, { id: user.id, locked: true });
			const lockedUser = await getOneUser(TEST_AUTH_TOKEN, user.id);
			expect(lockedUser.locked).toBeTrue();
			expect(isValidUser(lockedUser)).toBeTrue();

			await updateOneUser(TEST_AUTH_TOKEN, { id: user.id, locked: false });
			const unlockedUser = await getOneUser(TEST_AUTH_TOKEN, user.id);
			expect(unlockedUser.locked).toBeFalse();
			expect(isValidUser(unlockedUser)).toBeTrue();
		}),
	);

	it(
		'Should update the user role',
		integrationTest(async () => {
			expect(isValidUser(user)).toBeTrue();
			expect(user.role).toBe('analyst');

			await updateOneUser(TEST_AUTH_TOKEN, { id: user.id, role: 'admin' });
			const updatedUser1 = await getOneUser(TEST_AUTH_TOKEN, user.id);
			expect(updatedUser1.role).toBe('admin');
			expect(isValidUser(updatedUser1)).toBeTrue();

			await updateOneUser(TEST_AUTH_TOKEN, { id: user.id, role: 'analyst' });
			const updatedUser2 = await getOneUser(TEST_AUTH_TOKEN, user.id);
			expect(updatedUser2.role).toBe('analyst');
			expect(isValidUser(updatedUser2)).toBeTrue();
		}),
	);

	it(
		'Should update my password, requiring the current one',
		integrationTest(async () => {
			const myUser = await getMyUser(TEST_AUTH_TOKEN);
			expect(isValidUser(myUser)).toBeTrue();

			const currentPassword = 'changeme';
			const newPassword = 'changeme2';

			// Current password works
			await expectAsync(login(myUser.username, currentPassword)).toBeResolved();

			// Didn't updated the password
			await expectAsync(updateOneUser(TEST_AUTH_TOKEN, { id: myUser.id, password: newPassword })).toBeRejected();

			// Current password still works
			await expectAsync(login(myUser.username, currentPassword)).toBeResolved();

			// Update the password
			await expectAsync(
				updateOneUser(TEST_AUTH_TOKEN, { id: myUser.id, password: newPassword, currentPassword }),
			).toBeResolved();

			// New password works
			await expectAsync(login(myUser.username, newPassword)).toBeResolved();

			// Teardown
			await expectAsync(
				updateOneUser(TEST_AUTH_TOKEN, { id: myUser.id, password: currentPassword, currentPassword: newPassword }),
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
			await expectAsync(updateOneUser(TEST_AUTH_TOKEN, { id: user.id, password: newPassword })).toBeResolved();

			// New password works
			await expectAsync(login(user.username, newPassword)).toBeResolved();
		}),
	);
});

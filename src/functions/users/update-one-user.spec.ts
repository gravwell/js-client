/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { random } from 'lodash';
import { CreatableUser, User, userDecoder } from '~/models';
import { integrationTest, integrationTestSpecDef, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeLoginOneUser } from '../auth/login-one-user';
import { makeCreateOneUser } from './create-one-user';
import { makeDeleteOneUser } from './delete-one-user';
import { makeGetAllUsers } from './get-all-users';
import { makeGetMyUser } from './get-my-user';
import { makeGetOneUser } from './get-one-user';
import { makeUpdateOneUser } from './update-one-user';

describe(
	'updateOneUser()',
	integrationTestSpecDef(() => {
		let updateOneUser: ReturnType<typeof makeUpdateOneUser>;
		beforeAll(async () => {
			updateOneUser = makeUpdateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let getOneUser: ReturnType<typeof makeGetOneUser>;
		beforeAll(async () => {
			getOneUser = makeGetOneUser(await TEST_BASE_API_CONTEXT());
		});
		let deleteOneUser: ReturnType<typeof makeDeleteOneUser>;
		beforeAll(async () => {
			deleteOneUser = makeDeleteOneUser(await TEST_BASE_API_CONTEXT());
		});
		let createOneUser: ReturnType<typeof makeCreateOneUser>;
		beforeAll(async () => {
			createOneUser = makeCreateOneUser(await TEST_BASE_API_CONTEXT());
		});
		let getMyUser: ReturnType<typeof makeGetMyUser>;
		beforeAll(async () => {
			getMyUser = makeGetMyUser(await TEST_BASE_API_CONTEXT());
		});
		let login: ReturnType<typeof makeLoginOneUser>;
		beforeAll(async () => {
			login = makeLoginOneUser(await TEST_BASE_API_CONTEXT());
		});
		let getAllUsers: ReturnType<typeof makeGetAllUsers>;
		beforeAll(async () => {
			getAllUsers = makeGetAllUsers(await TEST_BASE_API_CONTEXT());
		});

		let user: User;

		beforeEach(async () => {
			// Delete all users, except the admin
			const currentUsers = await getAllUsers();
			const myUser = await getMyUser();
			const currentUserIDs = currentUsers.map(u => u.id).filter(userID => userID !== myUser.id);
			const deleteUserPromises = currentUserIDs.map(userID => deleteOneUser(userID));
			await Promise.all(deleteUserPromises);

			const username = 'test-user-' + random(0, Number.MAX_SAFE_INTEGER);
			const data: CreatableUser = {
				name: 'Test',
				email: username + '@example.com',
				password: 'changeme',
				role: 'analyst',
				username,
			};
			user = await createOneUser(data);
		});

		afterEach(async () => {
			await deleteOneUser(user.id);
		});

		it(
			"Should update the user's username",
			integrationTest(async () => {
				expect(userDecoder.decode(user).ok).toBeTrue();

				const newUsername = 'new-username-' + random(0, Number.MAX_SAFE_INTEGER);
				expect(newUsername).not.toBe(user.username);

				await updateOneUser({ id: user.id, username: newUsername });
				const updatedUser = await getOneUser(user.id);
				expect(updatedUser.username).toBe(newUsername);
				expect(userDecoder.decode(updatedUser).ok).toBeTrue();
			}),
		);

		it(
			'Should update the user email',
			integrationTest(async () => {
				expect(userDecoder.decode(user).ok).toBeTrue();

				const newEmail = 'new-email-' + random(0, Number.MAX_SAFE_INTEGER) + '@example.com';
				expect(newEmail).not.toBe(user.email);

				await updateOneUser({ id: user.id, email: newEmail });
				const updatedUser = await getOneUser(user.id);
				expect(updatedUser.email).toBe(newEmail);
				expect(userDecoder.decode(updatedUser).ok).toBeTrue();
			}),
		);

		it(
			'Should update the user name',
			integrationTest(async () => {
				expect(userDecoder.decode(user).ok).toBeTrue();

				const newName = 'new-name-' + random(0, Number.MAX_SAFE_INTEGER);
				expect(newName).not.toBe(user.name);

				await updateOneUser({ id: user.id, name: newName });
				const updatedUser = await getOneUser(user.id);
				expect(updatedUser.name).toBe(newName);
				expect(userDecoder.decode(updatedUser).ok).toBeTrue();
			}),
		);

		it(
			'Should update the user locked state',
			integrationTest(async () => {
				expect(userDecoder.decode(user).ok).toBeTrue();
				expect(user.isLocked).toBeFalse();

				await updateOneUser({ id: user.id, isLocked: true });
				const lockedUser = await getOneUser(user.id);
				expect(lockedUser.isLocked).toBeTrue();
				expect(userDecoder.decode(lockedUser).ok).toBeTrue();

				await updateOneUser({ id: user.id, isLocked: false });
				const unlockedUser = await getOneUser(user.id);
				expect(unlockedUser.isLocked).toBeFalse();
				expect(userDecoder.decode(unlockedUser).ok).toBeTrue();
			}),
		);

		it(
			'Should update the user role',
			integrationTest(async () => {
				expect(userDecoder.decode(user).ok).toBeTrue();
				expect(user.role).toBe('analyst');

				await updateOneUser({ id: user.id, role: 'admin' });
				const updatedUser1 = await getOneUser(user.id);
				expect(updatedUser1.role).toBe('admin');
				expect(userDecoder.decode(updatedUser1).ok).toBeTrue();

				await updateOneUser({ id: user.id, role: 'analyst' });
				const updatedUser2 = await getOneUser(user.id);
				expect(updatedUser2.role).toBe('analyst');
				expect(userDecoder.decode(updatedUser2).ok).toBeTrue();
			}),
		);

		it(
			'Should update my password, requiring the current one',
			integrationTest(async () => {
				const myUser = await getMyUser();
				expect(userDecoder.decode(myUser).ok).toBeTrue();

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
				expect(userDecoder.decode(user).ok).toBeTrue();
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
				expect(userDecoder.decode(updatedUser).ok).toBeTrue();
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
				expect(userDecoder.decode(updatedUser).ok).toBeTrue();
			}),
		);
	}),
);

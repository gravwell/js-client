/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_AUTH_TOKEN, TEST_HOST } from '../../tests';
import { makeCreateOneGroup } from '../groups';
import { makeCreateOneTargetedNotification } from './create-one-targeted-notification';

describe('createOneTargetedNotification', () => {
	const createOneTargetedNotification = makeCreateOneTargetedNotification({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});
	const createOneGroup = makeCreateOneGroup({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	it(
		'Should be able to create a targeted message to myself',
		integrationTest(async () => {
			const result = await createOneTargetedNotification('myself', { message: 'test myself' });
			expect(result).toBeUndefined();
		}),
	);

	// Not working
	it(
		'Should be able to create a targeted message to a group',
		integrationTest(async () => {
			const groupID = await createOneGroup({ name: '1' });

			const result = await createOneTargetedNotification('group', {
				message: 'test group',
				groupID,
			});
			expect(result).toBeUndefined();
		}),
	);

	// Not working
	it(
		'Should be able to create a targeted message to a user',
		integrationTest(async () => {
			const result = await createOneTargetedNotification('user', {
				message: 'test user',
				userID: '1',
			});
			expect(result).toBeUndefined();
		}),
	);
});

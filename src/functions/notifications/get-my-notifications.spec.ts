/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_AUTH_TOKEN, TEST_HOST } from '../../tests';
import { makeGetMyNotifications } from './get-my-notifications';

describe('getMyNotifications', () => {
	const getMyNotifications = makeGetMyNotifications({
		host: TEST_HOST,
		useEncryption: false,
	});

	it(
		'Should be able to get all my notifications',
		integrationTest(async () => {
			const notifications = await getMyNotifications(TEST_AUTH_TOKEN);
			expect(notifications instanceof Array).toBeTrue();
		}),
	);
});

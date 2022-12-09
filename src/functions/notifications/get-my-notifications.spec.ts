/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeGetMyNotifications } from './get-my-notifications';

describe('getMyNotifications', () => {
	let getMyNotifications: ReturnType<typeof makeGetMyNotifications>;
	beforeAll(async () => {
		getMyNotifications = makeGetMyNotifications(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should be able to get all my notifications',
		integrationTest(async () => {
			const notifications = await getMyNotifications();
			expect(notifications instanceof Array).toBeTrue();
		}),
	);
});

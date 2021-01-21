/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeGetMyNotifications } from './get-my-notifications';

describe('getMyNotifications', () => {
	const getMyNotifications = makeGetMyNotifications(TEST_BASE_API_CONTEXT);

	it(
		'Should be able to get all my notifications',
		integrationTest(async () => {
			const notifications = await getMyNotifications();
			expect(notifications instanceof Array).toBeTrue();
		}),
	);
});

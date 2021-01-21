/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneTargetedNotification } from './create-one-targeted-notification';
import { makeDeleteOneNotification } from './delete-one-notification';
import { makeGetMyNotifications } from './get-my-notifications';

describe('deleteOneNotification()', () => {
	const deleteOneNotification = makeDeleteOneNotification(TEST_BASE_API_CONTEXT);
	const getMyNotifications = makeGetMyNotifications(TEST_BASE_API_CONTEXT);
	const targetOneNotification = makeCreateOneTargetedNotification(TEST_BASE_API_CONTEXT);

	it(
		'Should delete the notification',
		integrationTest(async () => {
			await targetOneNotification('myself', { message: 'test' });

			const notifications = await getMyNotifications();
			await Promise.all(notifications.map(n => deleteOneNotification(n.id)));

			const notificationsKept = await getMyNotifications();
			const notificationsKeptIDs = new Set(notificationsKept.map(n => n.id));
			const notificationsDeleted = notifications.filter(n => !notificationsKeptIDs.has(n.id));

			expect(notificationsDeleted.length).toBeGreaterThan(0);
		}),
	);
});

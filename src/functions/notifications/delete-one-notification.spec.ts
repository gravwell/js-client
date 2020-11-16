/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeCreateOneTargetedNotification } from './create-one-targeted-notification';
import { makeDeleteOneNotification } from './delete-one-notification';
import { makeGetMyNotifications } from './get-my-notifications';

describe('deleteOneNotification()', () => {
	const deleteOneNotification = makeDeleteOneNotification({ host: TEST_HOST, useEncryption: false });
	const getMyNotifications = makeGetMyNotifications({ host: TEST_HOST, useEncryption: false });
	const targetOneNotification = makeCreateOneTargetedNotification({ host: TEST_HOST, useEncryption: false })(
		TEST_AUTH_TOKEN,
	);

	it(
		'Should delete the notification',
		integrationTest(async () => {
			await targetOneNotification('myself', { message: 'test' });

			const notifications = await getMyNotifications(TEST_AUTH_TOKEN);
			await Promise.all(notifications.map(n => deleteOneNotification(TEST_AUTH_TOKEN, n.id)));

			const notificationsKept = await getMyNotifications(TEST_AUTH_TOKEN);
			const notificationsKeptIDs = new Set(notificationsKept.map(n => n.id));
			const notificationsDeleted = notifications.filter(n => !notificationsKeptIDs.has(n.id));

			expect(notificationsDeleted.length).toBeGreaterThan(0);
		}),
	);
});

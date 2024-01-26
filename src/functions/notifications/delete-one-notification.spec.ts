/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest } from '~/tests/test-types';
import { makeCreateOneTargetedNotification } from './create-one-targeted-notification';
import { makeDeleteOneNotification } from './delete-one-notification';
import { makeGetMyNotifications } from './get-my-notifications';

describe('deleteOneNotification()', () => {
	let deleteOneNotification: ReturnType<typeof makeDeleteOneNotification>;
	beforeAll(async () => {
		deleteOneNotification = makeDeleteOneNotification(await TEST_BASE_API_CONTEXT());
	});
	let getMyNotifications: ReturnType<typeof makeGetMyNotifications>;
	beforeAll(async () => {
		getMyNotifications = makeGetMyNotifications(await TEST_BASE_API_CONTEXT());
	});
	let targetOneNotification: ReturnType<typeof makeCreateOneTargetedNotification>;
	beforeAll(async () => {
		targetOneNotification = makeCreateOneTargetedNotification(await TEST_BASE_API_CONTEXT());
	});

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

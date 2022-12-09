/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { CreatableBroadcastNotification } from '~/models';
import { integrationTest, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeCreateOneBroadcastedNotification } from './create-one-broadcasted-notification';

describe('createOneBroadcastedNotification', () => {
	let createOneBroadcastedNotification: ReturnType<typeof makeCreateOneBroadcastedNotification>;
	beforeAll(async () => {
		createOneBroadcastedNotification = makeCreateOneBroadcastedNotification(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should be able to create a broadcasted message',
		integrationTest(async () => {
			const creatable: CreatableBroadcastNotification = { message: 'test', level: 'info', link: '' };
			const result = await createOneBroadcastedNotification(creatable);
			expect(result).toBeUndefined();
		}),
	);
});

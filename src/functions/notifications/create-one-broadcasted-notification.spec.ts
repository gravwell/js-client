/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { integrationTest, TEST_HOST, TEST_AUTH_TOKEN } from '../../tests';
import {
	makeCreateOneBroadcastedNotification,
	CreatableBroadcastNotification,
} from './create-one-broadcasted-notification';

describe('createOneBroadcastedNotification', () => {
	const createOneBroadcastedNotification = makeCreateOneBroadcastedNotification({
		host: TEST_HOST,
		useEncryption: false,
	});

	it(
		'Should be able to create a broadcasted message',
		integrationTest(async () => {
			const creatable: CreatableBroadcastNotification = { message: 'test' };
			const result = await createOneBroadcastedNotification(TEST_AUTH_TOKEN, creatable);
			expect(result).toBeUndefined();
		}),
	);
});

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableBroadcastNotification } from '../../models';
import { integrationTest, TEST_AUTH_TOKEN, TEST_HOST } from '../../tests';
import { makeCreateOneBroadcastedNotification } from './create-one-broadcasted-notification';

describe('createOneBroadcastedNotification', () => {
	const createOneBroadcastedNotification = makeCreateOneBroadcastedNotification({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	it(
		'Should be able to create a broadcasted message',
		integrationTest(async () => {
			const creatable: CreatableBroadcastNotification = { message: 'test' };
			const result = await createOneBroadcastedNotification(creatable);
			expect(result).toBeUndefined();
		}),
	);
});

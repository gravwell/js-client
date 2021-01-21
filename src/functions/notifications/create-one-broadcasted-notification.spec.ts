/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableBroadcastNotification } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneBroadcastedNotification } from './create-one-broadcasted-notification';

describe('createOneBroadcastedNotification', () => {
	const createOneBroadcastedNotification = makeCreateOneBroadcastedNotification(TEST_BASE_API_CONTEXT);

	it(
		'Should be able to create a broadcasted message',
		integrationTest(async () => {
			const creatable: CreatableBroadcastNotification = { message: 'test' };
			const result = await createOneBroadcastedNotification(creatable);
			expect(result).toBeUndefined();
		}),
	);
});

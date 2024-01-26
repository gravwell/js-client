/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest, unitTest } from '~/tests/test-types';
import { APISubscription } from '../utils/api-subscription';
import {
	makeSubscribeToManySystemInformations,
	SystemStatusCategory,
	SystemStatusMessageReceived,
	SystemStatusMessageSent,
} from './subscribe-to-many-system-informations';

const wait = (n: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, n));

describe('subscribeToManySystemInformations()', () => {
	let subscribeToManySystemInformations: ReturnType<typeof makeSubscribeToManySystemInformations>;
	beforeAll(async () => {
		subscribeToManySystemInformations = makeSubscribeToManySystemInformations(await TEST_BASE_API_CONTEXT());
	});

	it(
		'Should return a function given a valid host',
		unitTest(async () => {
			const context = await TEST_BASE_API_CONTEXT();
			const fn = (): ((
				statusCategories: Array<SystemStatusCategory>,
			) => Promise<APISubscription<SystemStatusMessageReceived, SystemStatusMessageSent>>) =>
				makeSubscribeToManySystemInformations({ ...context, host: 'www.example.com' });
			expect(fn).not.toThrow();
			expect(typeof fn()).toBe('function');
		}),
	);

	it(
		'Should subscribe to ping information',
		integrationTest(async () => {
			const pingSubscription = await subscribeToManySystemInformations(['ping']);
			await wait(1500);
			pingSubscription.close();

			for (const message of pingSubscription.received) {
				if ((message as any).type !== undefined) {
					expect((message as any).type).toBe('ping');
				} else {
					expect(message).toEqual({ Resp: 'ACK' });
				}
			}
		}),
	);
});

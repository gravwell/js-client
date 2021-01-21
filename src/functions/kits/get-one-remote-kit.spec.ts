/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isRemoteKit } from '../../models';
import { integrationTest, TEST_AUTH_TOKEN, TEST_HOST } from '../../tests';
import { makeGetAllRemoteKits } from './get-all-remote-kits';
import { makeGetOneRemoteKit } from './get-one-remote-kit';

describe('getOneRemoteKit()', () => {
	const getOneRemoteKit = makeGetOneRemoteKit({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });
	const getAllRemoteKits = makeGetAllRemoteKits({ host: TEST_HOST, useEncryption: false, authToken: TEST_AUTH_TOKEN });

	it(
		'Returns a remote kit',
		integrationTest(async () => {
			const kits = (await getAllRemoteKits()).slice(0, 6);
			expect(kits.length).toBeGreaterThan(5);
			for (const kit of kits) expect(isRemoteKit(kit)).toBeTrue();

			const ps = kits.map(async kit => {
				const _kit = await getOneRemoteKit(kit.globalID);
				expect(_kit).toEqual(kit);
			});
			await Promise.all(ps);
		}),
	);

	it(
		"Returns an error if the remote kit doesn't exist",
		integrationTest(async () => {
			await expectAsync(getOneRemoteKit('non-existent')).toBeRejected();
		}),
	);
});

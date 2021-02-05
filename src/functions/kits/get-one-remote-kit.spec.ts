/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isRemoteKit } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeGetAllRemoteKits } from './get-all-remote-kits';
import { makeGetOneRemoteKit } from './get-one-remote-kit';

describe('getOneRemoteKit()', () => {
	const getOneRemoteKit = makeGetOneRemoteKit(TEST_BASE_API_CONTEXT);
	const getAllRemoteKits = makeGetAllRemoteKits(TEST_BASE_API_CONTEXT);

	xit(
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

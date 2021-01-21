/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isRenderModule } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeGetAllRenderModules } from './get-all-render-modules';

describe('getAllRenderModules()', () => {
	const getAllRenderModules = makeGetAllRenderModules({
		host: TEST_HOST,
		useEncryption: false,
		authToken: TEST_AUTH_TOKEN,
	});

	it(
		'Should return all render modules',
		integrationTest(async () => {
			const renderModules = await getAllRenderModules();
			expect(renderModules.length).toBeGreaterThan(10);
			expect(renderModules.every(isRenderModule)).toBeTrue();
		}),
	);
});

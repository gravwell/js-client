/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isRenderModule } from '~/models/render-module/is-render-module';
import { TEST_BASE_API_CONTEXT } from '~/tests/config';
import { integrationTest } from '~/tests/test-types';
import { makeGetAllRenderModules } from './get-all-render-modules';

describe('getAllRenderModules()', () => {
	let getAllRenderModules: ReturnType<typeof makeGetAllRenderModules>;
	beforeAll(async () => {
		getAllRenderModules = makeGetAllRenderModules(await TEST_BASE_API_CONTEXT());
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

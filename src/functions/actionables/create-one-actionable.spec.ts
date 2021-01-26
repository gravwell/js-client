/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableActionable, isActionable } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { makeCreateOneActionable } from './create-one-actionable';

describe('createOneActionable()', () => {
	const createOneActionable = makeCreateOneActionable(TEST_BASE_API_CONTEXT);

	// gravwell/gravwell#2425
	xit(
		'Should create an actionable and return it',
		integrationTest(async () => {
			const data: CreatableActionable = {
				name: 'Actionable test',
				actions: [{ name: 'Action test', command: { type: 'query', userQuery: 'tag=netflow' } }],
				triggers: [{ pattern: /abc/g, activatesOn: 'clicks and selection' }],
			};

			const actionable = await createOneActionable(data);
			expect(isActionable(actionable)).toBeTrue();
		}),
	);
});

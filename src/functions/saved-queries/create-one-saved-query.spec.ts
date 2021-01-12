/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatableSavedQuery, isSavedQuery } from '../../models';
import { integrationTest, myCustomMatchers } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { NumericID } from '../../value-objects';
import { makeCreateOneGroup } from '../groups/create-one-group';
import { makeCreateOneSavedQuery } from './create-one-saved-query';

describe('createOneSavedQuery()', () => {
	const createOneSavedQuery = makeCreateOneSavedQuery({ host: TEST_HOST, useEncryption: false });
	const createOneGroup = makeCreateOneGroup({ host: TEST_HOST, useEncryption: false });

	let groupIDs: Array<NumericID>;

	beforeEach(async () => {
		jasmine.addMatchers(myCustomMatchers);

		groupIDs = await Promise.all(
			Array.from({ length: 3 })
				.map((_, i) => `G${i}`)
				.map(name => createOneGroup(TEST_AUTH_TOKEN, { name })),
		);
	});

	it(
		'Should create a saved query and return it',
		integrationTest(async () => {
			const data: CreatableSavedQuery = {
				groupIDs,
				isGlobal: true,

				name: 'name',
				description: 'description',
				labels: ['Label 1', 'Label 2'],

				query: 'tag=netflow',
			};

			const savedQuery = await createOneSavedQuery(TEST_AUTH_TOKEN, data);
			expect(isSavedQuery(savedQuery)).toBeTrue();
			expect(savedQuery).toPartiallyEqual(data);
		}),
	);
});

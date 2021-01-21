/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { CreatablePlaybook, isPlaybook } from '../../models';
import { integrationTest } from '../../tests';
import { TEST_BASE_API_CONTEXT } from '../../tests/config';
import { isUUID } from '../../value-objects';
import { makeCreateOnePlaybook } from './create-one-playbook';
import { makeDeleteOnePlaybook } from './delete-one-playbook';
import { makeGetOnePlaybook } from './get-one-playbook';

describe('deleteOnePlaybook()', () => {
	const deleteOnePlaybook = makeDeleteOnePlaybook(TEST_BASE_API_CONTEXT);
	const createOnePlaybook = makeCreateOnePlaybook(TEST_BASE_API_CONTEXT);
	const getOnePlaybook = makeGetOnePlaybook(TEST_BASE_API_CONTEXT);

	it(
		'Should delete an playbook',
		integrationTest(async () => {
			const data: CreatablePlaybook = {
				name: 'Playbook test',
				body: 'This is my playbook',
			};

			const playbookUUID = await createOnePlaybook(data);
			expect(isUUID(playbookUUID)).toBeTrue();
			const playbook = await getOnePlaybook(playbookUUID);
			expect(isPlaybook(playbook)).toBeTrue();

			await expectAsync(deleteOnePlaybook(playbookUUID)).toBeResolved();
			await expectAsync(getOnePlaybook(playbookUUID)).toBeRejected();
		}),
	);
});

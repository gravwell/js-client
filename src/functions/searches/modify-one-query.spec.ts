/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { makeCreateOneAutoExtractor } from '~/functions/auto-extractors/create-one-auto-extractor';
import { ElementFilter } from '~/models';
import { integrationTestSpecDef, sleep, TEST_BASE_API_CONTEXT } from '~/tests';
import { makeIngestMultiLineEntry } from '../ingestors/ingest-multi-line-entry';
import { makeGetAllTags } from '../tags/get-all-tags';
import { makeModifyOneQuery } from './modify-one-query';
import { makeValidateOneQuery } from './validate-one-query';

interface Entry {
	timestamp: string;
	value: { foo: number };
}

describe(
	'modifyOneQuery()',
	integrationTestSpecDef(() => {
		// Use a randomly generated tag, so that we know exactly what we're going to query
		const tag = uuidv4();

		// The number of entries to generate
		const count = 1000;

		// The start date for generated queries
		const start = new Date(2010, 0, 0);

		// The end date for generated queries; one minute between each entry
		// const end = addMinutes(start, count - 1);

		beforeAll(async () => {
			// Generate and ingest some entries
			const ingestMultiLineEntry = makeIngestMultiLineEntry(await TEST_BASE_API_CONTEXT());
			const values: Array<string> = [];
			for (let i = 0; i < count; i++) {
				const value: Entry = { timestamp: addMinutes(start, i).toISOString(), value: { foo: i } };
				values.push(JSON.stringify(value));
			}
			const data: string = values.join('\n');
			await ingestMultiLineEntry({ data, tag, assumeLocalTimezone: false });

			// Check the list of tags until our new tag appears
			const getAllTags = makeGetAllTags(await TEST_BASE_API_CONTEXT());
			while (!(await getAllTags()).includes(tag)) {
				// Give the backend a moment to catch up
				await sleep(1000);
			}

			// Create an AX definition for the generated tag

			const createOneAutoExtractor = makeCreateOneAutoExtractor(await TEST_BASE_API_CONTEXT());
			await createOneAutoExtractor({
				tag,
				name: `${tag} - JSON`,
				description: '-',
				module: 'json',
				parameters: 'value value.foo',
			});
		}, 25000);

		it('Should return a new query with the filter applied', async () => {
			const validateOneQuery = makeValidateOneQuery(await TEST_BASE_API_CONTEXT());
			const modifyOneQuery = makeModifyOneQuery(await TEST_BASE_API_CONTEXT());

			const query = `tag=${tag} table`;
			const validation = await validateOneQuery(query);
			expect(validation.isValid).withContext(`Expect initial query to be valid`).toBeTrue();

			const filter: ElementFilter = {
				path: 'value.foo',
				operation: '==',
				value: '50',
				tag,
				module: 'json',
				arguments: null,
			};
			const newQuery = await modifyOneQuery(query, [filter]);
			const newValidation = await validateOneQuery(newQuery);
			expect(newValidation.isValid).withContext(`Expect new query to be valid`).toBeTrue();

			expect(newQuery).withContext(`Expect new query to be different than initial one`).not.toBe(query);
			expect(newQuery.startsWith(`tag=${tag}`))
				.withContext(`Expect new query to use the same tag`)
				.toBeTrue();
		});

		it('Should throw if the filters are invalid', async () => {
			const validateOneQuery = makeValidateOneQuery(await TEST_BASE_API_CONTEXT());
			const modifyOneQuery = makeModifyOneQuery(await TEST_BASE_API_CONTEXT());

			const query = `tag=${tag} table`;
			const validation = await validateOneQuery(query);
			expect(validation.isValid).withContext(`Expect initial query to be valid`).toBeTrue();

			const filter: ElementFilter = {
				path: 'Src',
				operation: '==',
				value: '50',
				tag,
				module: 'netflow',
				arguments: null,
			};
			await expectAsync(modifyOneQuery(query, [filter]))
				.withContext(`Expect invalid filter to cause an error`)
				.toBeRejectedWithError(Error, 'netflow (module idx 0) error: Malformed IPv6 Address');
		});
	}),
);

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { subDays } from 'date-fns';
import { integrationTest } from '../../tests';
import { TEST_AUTH_TOKEN, TEST_HOST } from '../../tests/config';
import { makeSubscribeToOneSearch } from './subscribe-to-one-search/subscribe-to-one-search';

xdescribe('subscribeToOneSearch()', () => {
	it(
		'Should work with queries using the raw renderer',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch({ host: TEST_HOST, useEncryption: false })(TEST_AUTH_TOKEN);
			const query = 'tag=netflow netflow Src Bytes | count Bytes by Src';
			const range: [Date, Date] = [subDays(new Date(), 7), new Date()];
			const search = await subscribeToOneSearch(query, range);

			search.progress$.subscribe(progress => console.log(`Progress ${progress}`));
			search.entries$.subscribe(entries => console.log(`Entries`, entries.names, entries.data));
			search.stats$.subscribe(stats => console.log(`Stats`, stats));

			await new Promise(res => setTimeout(res, 10000));
		}),
		25000,
	);

	it(
		'Should work with queries using the chart renderer',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch({ host: TEST_HOST, useEncryption: false })(TEST_AUTH_TOKEN);
			const query = 'tag=netflow netflow Bytes Src | count Bytes by Src | chart count by Src';
			const range: [Date, Date] = [subDays(new Date(), 7), new Date()];
			const search = await subscribeToOneSearch(query, range);

			search.progress$.subscribe(progress => console.log(`Progress ${progress}`));
			search.entries$.subscribe(entries => console.log(`Entries`, entries.names, entries.data));
			search.stats$.subscribe(stats => console.log(`Stats`, stats));

			await new Promise(res => setTimeout(res, 10000));
		}),
		25000,
	);

	it(
		'Should work with queries using the table renderer',
		integrationTest(async () => {
			const subscribeToOneSearch = makeSubscribeToOneSearch({ host: TEST_HOST, useEncryption: false })(TEST_AUTH_TOKEN);
			const query = 'tag=netflow netflow Src Dst | table';
			const range: [Date, Date] = [subDays(new Date(), 7), new Date()];
			const search = await subscribeToOneSearch(query, range);

			search.progress$.subscribe(progress => console.log(`Progress ${progress}`));
			search.entries$.subscribe(entries => console.log(`Entries`, entries.names, entries.data));
			search.stats$.subscribe(stats => console.log(`Stats`, stats));

			await new Promise(res => setTimeout(res, 10000));
		}),
		25000,
	);
});

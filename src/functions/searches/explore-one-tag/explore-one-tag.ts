/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { subDays } from 'date-fns';
import { isNull } from 'lodash';
import { from, lastValueFrom, Subscription } from 'rxjs';
import { concatMap, filter, map, takeWhile } from 'rxjs/operators';
import {
	RawRequestExplorerSearchEntriesWithinRangeMessageSent,
	RawSearchMessageReceivedRequestExplorerEntriesWithinRange,
	SearchMessageCommands,
} from '~/models';
import { DataExplorerEntry } from '~/models/search/data-explorer-entry';
import { toDataExplorerEntry } from '~/models/search/to-data-explorer-entry';
import { APIContext } from '../../utils';
import { initiateSearch } from '../initiate-search';
import { makeSubscribeToOneRawSearch } from '../subscribe-to-one-raw-search';

export const makeExploreOneTag = (context: APIContext) => {
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;
	let closedSub: Subscription | null = null;

	return async (
		tag: string,
		options: { range?: [Date, Date]; limit?: number; noHistory?: boolean } = {},
	): Promise<Array<DataExplorerEntry>> => {
		if (isNull(rawSubscriptionP)) {
			rawSubscriptionP = subscribeToOneRawSearch();
			if (closedSub?.closed === false) {
				closedSub.unsubscribe();
			}

			// Handles websocket hangups
			closedSub = from(rawSubscriptionP)
				.pipe(concatMap(rawSubscription => rawSubscription.received$))
				.subscribe({
					complete: () => {
						rawSubscriptionP = null;
					},
				});
		}
		const rawSubscription = await rawSubscriptionP;

		const range = options.range ?? [subDays(new Date(), 7), new Date()];
		const limit = options.limit ?? 1000;
		const query = `tag=${tag}`;

		const searchInitMsg = await initiateSearch(rawSubscription, query, { range, noHistory: options.noHistory });
		const searchTypeID = searchInitMsg.data.OutputSearchSubproto;
		const searchMessages$ = rawSubscription.received$.pipe(filter(msg => msg.type === searchTypeID));

		const exploredElementsP: Promise<Array<DataExplorerEntry>> = lastValueFrom(
			searchMessages$.pipe(
				filter((msg): msg is RawSearchMessageReceivedRequestExplorerEntriesWithinRange => {
					try {
						const _msg = msg as RawSearchMessageReceivedRequestExplorerEntriesWithinRange;
						return _msg.data.ID === SearchMessageCommands.RequestExplorerEntriesWithinRange;
					} catch {
						return false;
					}
				}),
				takeWhile(msg => msg.data.Finished === false, true),
				map(msg => (msg.data.Explore ?? []).map(toDataExplorerEntry)),
			),
		);

		// Request messages
		await (async (): Promise<void> => {
			const first = 0;
			const last = limit;
			const start = range[0].toISOString();
			const end = range[1].toISOString();

			const requestEntriesMsg: RawRequestExplorerSearchEntriesWithinRangeMessageSent = {
				type: searchTypeID,
				data: {
					ID: SearchMessageCommands.RequestExplorerEntriesWithinRange,
					Addendum: {},
					EntryRange: {
						First: first,
						Last: last,
						StartTS: start,
						EndTS: end,
					},
				},
			};
			const entriesP = rawSubscription.send(requestEntriesMsg);

			await Promise.all([entriesP]);
		})();

		return exploredElementsP;
	};
};

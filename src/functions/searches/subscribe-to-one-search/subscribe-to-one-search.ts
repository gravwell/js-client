/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isEqual, isNull, isUndefined } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import {
	Query,
	RawAcceptSearchMessageSent,
	RawInitiateSearchMessageSent,
	RawRequestSearchEntriesWithinRangeMessageSent,
	RawResponseForSearchDetailsMessageReceived,
	RawResponseForSearchStatsMessageReceived,
	RawSearchInitiatedMessageReceived,
	RawSearchMessageReceivedRequestEntriesWithinRange,
	SearchEntries,
	SearchFilter,
	SearchMessageCommands,
	SearchStats,
	SearchSubscription,
} from '../../../models';
import { Percentage, toNumericID } from '../../../value-objects';
import { APIContext, promiseProgrammatically } from '../../utils';
import { makeSubscribeToOneRawSearch } from './subscribe-to-one-raw-search';

export const makeSubscribeToOneSearch = (context: APIContext) => {
	const subscribeToOneRawSearch = makeSubscribeToOneRawSearch(context);
	let rawSubscriptionP: ReturnType<typeof subscribeToOneRawSearch> | null = null;

	return async (
		query: Query,
		range: [Date, Date],
		options: { filter?: Partial<SearchFilter> } = {},
	): Promise<SearchSubscription> => {
		if (isNull(rawSubscriptionP)) rawSubscriptionP = subscribeToOneRawSearch();
		const rawSubscription = await rawSubscriptionP;
		const initialFilter = { start: range[0], end: range[1], limit: 100, ...(options.filter ?? {}) };

		const searchTypeIDP = promiseProgrammatically<string>();
		rawSubscription.received$
			.pipe(
				filter((msg): msg is RawSearchInitiatedMessageReceived => {
					try {
						const _msg = <RawSearchInitiatedMessageReceived>msg;
						return _msg.type === 'search' && _msg.data.RawQuery === query;
					} catch {
						return false;
					}
				}),
				first(),
			)
			.subscribe(
				msg => {
					searchTypeIDP.resolve(msg.data.OutputSearchSubproto);
					rawSubscription.send(<RawAcceptSearchMessageSent>{
						type: 'search',
						data: { OK: true, OutputSearchSubproto: msg.data.OutputSearchSubproto },
					});
				},
				err => searchTypeIDP.reject(err),
			);

		rawSubscription.send(<RawInitiateSearchMessageSent>{
			type: 'search',
			data: {
				Background: false,
				Metadata: {} as any,
				SearchStart: range[0].toISOString(),
				SearchEnd: range[1].toISOString(),
				SearchString: query,
			},
		});

		const searchTypeID = await searchTypeIDP.promise;
		const searchMessages$ = rawSubscription.received$.pipe(filter(msg => msg.type === searchTypeID));

		const progress$: Observable<Percentage> = searchMessages$.pipe(
			map(msg => (msg as Partial<RawResponseForSearchDetailsMessageReceived>).data?.Finished ?? null),
			filter(isBoolean),
			map(done => (done ? 1 : 0)),
			distinctUntilChanged(),
			map(rawPercentage => new Percentage(rawPercentage)),
		);

		const entries$ = searchMessages$.pipe(
			filter((msg): msg is RawSearchMessageReceivedRequestEntriesWithinRange => {
				try {
					const _msg = <RawSearchMessageReceivedRequestEntriesWithinRange>msg;
					return _msg.data.ID === SearchMessageCommands.RequestEntriesWithinRange;
				} catch {
					return false;
				}
			}),
			map(
				(msg): SearchEntries => ({
					start: new Date(msg.data.EntryRange.StartTS),
					end: new Date(msg.data.EntryRange.EndTS),

					// TODO
					// isArray(msg.data.Entries)
					// 	? ['Data']
					// 	: isRawTableEntries(msg.data.Entries)
					// 	? msg.data.Entries.Columns
					// 	: isArray(msg.data.Entries.Names)
					// 	? msg.data.Entries.Names
					// 	: [msg.data.Entries.Names]
					names: [],

					// TODO
					// data: isArray(msg.data.Entries)
					// ? msg.data.Entries.map(rawData => ({
					// 		timestamp: new Date(rawData.TS),
					// 		values: [base64Decode(rawData.Data)],
					// 	}))
					// : isRawTableEntries(msg.data.Entries)
					// ? isNull(msg.data.Entries.Rows)
					// 	? []
					// 	: msg.data.Entries.Rows.map(rawData => ({ timestamp: new Date(rawData.TS), values: rawData.Row }))
					// : msg.data.Entries.Values.map(rawData => ({ timestamp: new Date(rawData.TS), values: rawData.Data })),
					data: [],
				}),
			),
		);

		const _filter$ = new BehaviorSubject(initialFilter);
		const setFilter = (filter: SearchFilter) => {
			_filter$.next(filter);
		};
		const filter$ = _filter$.asObservable().pipe(distinctUntilChanged((a, b) => isEqual(a, b)));

		const requestEntries = (filter: SearchFilter) =>
			rawSubscription.send(<RawRequestSearchEntriesWithinRangeMessageSent>{
				type: searchTypeID,
				data: {
					ID: SearchMessageCommands.RequestEntriesWithinRange,
					Addendum: {},
					EntryRange: {
						First: 0,
						Last: filter.limit,
						StartTS: filter.start.toISOString(),
						EndTS: filter.end.toISOString(),
					},
				},
			});

		filter$.subscribe(filter => {
			requestEntries(filter);
			setTimeout(() => requestEntries(filter), 2000); // TODO: Change this
		});

		const rawSearchStats$ = searchMessages$.pipe(
			filter((msg): msg is RawResponseForSearchStatsMessageReceived => {
				try {
					const _msg = <RawResponseForSearchStatsMessageReceived>msg;
					return _msg.data.ID === SearchMessageCommands.RequestAllStats;
				} catch {
					return false;
				}
			}),
		);

		const rawSearchDetails$ = searchMessages$.pipe(
			filter((msg): msg is RawResponseForSearchDetailsMessageReceived => {
				try {
					const _msg = <RawResponseForSearchDetailsMessageReceived>msg;
					return _msg.data.ID === SearchMessageCommands.RequestDetails;
				} catch {
					return false;
				}
			}),
		);

		const stats$ = combineLatest(rawSearchStats$, rawSearchDetails$).pipe(
			map(
				([rawStats, rawDetails]): SearchStats => ({
					id: rawDetails.data.SearchInfo.ID,
					userID: toNumericID(rawDetails.data.SearchInfo.UID),

					entries: rawStats.data.EntryCount,
					duration: rawDetails.data.SearchInfo.Duration,
					start: new Date(rawDetails.data.SearchInfo.StartRange),
					end: new Date(rawDetails.data.SearchInfo.EndRange),

					storeSize: rawDetails.data.SearchInfo.StoreSize,
					processed: {
						entries: 0, // ?QUESTION: How to calculate that?
						bytes: 0, // ?QUESTION: How to calculate that?
					},

					pipeline: rawStats.data.Stats.Set.map(s => s.Stats)
						.reduce<
							Array<Array<RawResponseForSearchStatsMessageReceived['data']['Stats']['Set'][number]['Stats'][number]>>
						>((acc, curr) => {
							curr.forEach((_curr, i) => {
								if (isUndefined(acc[i])) acc[i] = [];
								acc[i].push(_curr);
							});
							return acc;
						}, [])
						.map(s =>
							s
								.map(_s => ({
									module: _s.Name,
									arguments: _s.Args,
									duration: _s.Duration,
									input: {
										bytes: _s.InputBytes,
										entries: _s.InputCount,
									},
									output: {
										bytes: _s.OutputBytes,
										entries: _s.OutputCount,
									},
								}))
								.reduce((acc, curr) => ({
									...curr,
									duration: acc.duration + curr.duration,
									input: {
										bytes: acc.input.bytes + curr.input.bytes,
										entries: acc.input.entries + curr.input.entries,
									},
									output: {
										bytes: acc.output.bytes + curr.output.bytes,
										entries: acc.output.entries + curr.output.entries,
									},
								})),
						),
				}),
			),
		);

		return { progress$, entries$, stats$, setFilter };
	};
};

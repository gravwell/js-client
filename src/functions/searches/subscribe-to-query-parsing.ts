/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Observable, timer } from 'rxjs';
import { filter, last, map, mapTo, startWith, takeUntil } from 'rxjs/operators';
import { ElementFilter, Query, RawQuery } from '~/models';
import {
	isOperationFilter,
	RawElementFilter,
	RawExtractionFilter,
	RawOperationFilter,
	RawPongMessageSent,
	toElementFilter,
	ValidatedQuery,
} from '~/models/search';
import { APIContext, APISubscription, apiSubscriptionFromWebSocket, buildURL, WebSocket } from '../utils';

export const makeSubscribeToOneQueryParsing = (context: APIContext) => {
	const templatePath = '/api/ws/search';
	const url = buildURL(templatePath, { ...context, protocol: 'ws' });

	return async (): Promise<
		APISubscription<ValidatedQuery & { id: number }, { id: number; query: Query; filters: Array<ElementFilter> }>
	> => {
		const socket = new WebSocket(url, context.authToken ?? undefined);
		const rawSubscription = apiSubscriptionFromWebSocket<
			RawQueryValidationMessageReceived,
			RawQueryValidationMessageSent
		>(socket);
		rawSubscription.send({ Subs: ['PONG', 'parse', 'search', 'attach'] });
		const wsClosed$: Observable<void> = rawSubscription.sent$.pipe(startWith(undefined), mapTo(undefined), last());
		timer(1000, 5000)
			.pipe(takeUntil(wsClosed$))
			.subscribe(() => {
				rawSubscription.send({ type: 'PONG', data: {} });
			});

		const received$ = rawSubscription.received$.pipe(
			filter((msg): msg is RawQueryValidationDesiredMessageReceived => {
				try {
					return (msg as RawQueryValidationDesiredMessageReceived)?.type === 'parse';
				} catch {
					return false;
				}
			}),
			map(msg => ({ ...toValidatedQuery(msg.data), id: msg.data.Sequence })),
		);

		const sent$ = rawSubscription.sent$.pipe(
			filter((msg): msg is RawQueryValidationDesiredMessageSent => {
				try {
					return (msg as RawQueryValidationDesiredMessageSent)?.type === 'parse';
				} catch {
					return false;
				}
			}),
			map(msg => ({
				id: msg.data.Sequence,
				query: msg.data.SearchString,
				filters: (msg.data.Filters ?? []).map(toElementFilter),
			})),
		);

		const received: Array<ValidatedQuery & { id: number }> = [];
		const sent: Array<{ id: number; query: Query; filters: Array<ElementFilter> }> = [];

		received$.subscribe(receivedMessage => received.push(receivedMessage));
		sent$.subscribe(sentMessage => sent.push(sentMessage));

		return {
			close: () => rawSubscription.close(),
			send: async msg => {
				const rawMsg: RawQueryValidationMessageSent = {
					type: 'parse',
					data: {
						SearchString: msg.query,
						Sequence: msg.id,
					},
				};
				if (msg.filters.length !== 0) {
					rawMsg.data.Filters = msg.filters.map(f => {
						if (isOperationFilter(f)) {
							const opFilter: RawOperationFilter = {
								Tag: f.tag ?? undefined,
								Module: f.module,
								Path: f.path,
								Args: f.arguments ?? undefined,
								Op: f.operation,
								Value: f.value,
							};
							return opFilter;
						}
						const exFilter: RawExtractionFilter = {
							Tag: f.tag ?? undefined,
							Module: f.module,
							Path: f.path,
							Args: f.arguments ?? undefined,
						};
						return exFilter;
					});
				}
				await rawSubscription.send(rawMsg);
			},
			received$,
			received,
			sent$,
			sent,
		};
	};
};

type RawQueryValidationDesiredMessageSent = {
	type: 'parse';
	data: {
		SearchString: string;
		Sequence: number;
		/** Include the Filters field during data exploration (data explorer) */
		Filters?: Array<RawElementFilter>;
	};
};
type RawQueryValidationMessageSent =
	| RawQueryValidationDesiredMessageSent
	| RawPongMessageSent
	| { Subs: Array<'PONG' | 'parse' | 'search' | 'attach'> };

type RawQueryValidationDesiredMessageReceived = { type: 'parse'; data: RawValidatedQuery };
type RawQueryValidationMessageReceived = RawQueryValidationDesiredMessageReceived | { Resp: 'ACK' };

interface RawValidatedQueryBase {
	CollapsingIndex: number;
	ModuleHints: Array<{
		Name: string;
		Condensing: boolean;
		ProducedEVs: Array<string> | null;
		ConsumedEVs: Array<string> | null;
		ResourcesNeeded: Array<string> | null;
	}> | null;
	ModuleIndex: number;
	ParsedQuery: RawQuery;
	Sequence: number;
	Tags: Array<string> | null;
	TimeZoomDisabled: boolean;
}

interface RawApprovedValidatedQuery extends RawValidatedQueryBase {
	GoodQuery: true;
	RawQuery: RawQuery;
	RenderModule: string;
}

interface RawRepprovedValidatedQuery extends RawValidatedQueryBase {
	GoodQuery: false;
	ParseError: string;
}

type RawValidatedQuery = RawApprovedValidatedQuery | RawRepprovedValidatedQuery;

const toValidatedQuery = (raw: RawValidatedQuery): ValidatedQuery => {
	switch (raw.GoodQuery) {
		case true:
			return {
				query: raw.ParsedQuery,
				isValid: true,
				error: null,
			};
		case false:
			return {
				query: raw.ParsedQuery,
				isValid: false,
				error: {
					message: raw.ParseError ?? 'Unknown error',
					module: raw.ModuleIndex,
				},
			};
	}
};

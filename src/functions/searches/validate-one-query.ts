/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, pick } from 'lodash';
import { filter, first, map } from 'rxjs/operators';
import { Query, RawQuery } from '../../models';
import { APIContext, APISubscription, apiSubscriptionFromWebSocket, buildURL, WebSocket } from '../utils';

export const makeValidateOneQuery = (context: APIContext) => {
	const subscribeToOneQueryValidation = makeSubscribeToOneQueryValidation(context);

	return (authToken: string | null) => {
		let querySubP: ReturnType<typeof subscribeToOneQueryValidation> | null = null;

		return async (query: Query): Promise<ValidatedQuery> => {
			if (isNull(querySubP)) querySubP = subscribeToOneQueryValidation(authToken);
			const querySub = await querySubP;
			const id = SEARCH_SOCKET_ID_GENERATOR.generate();

			const validationP = querySub.received$
				.pipe(
					filter(msg => msg.id === id),
					map(msg => pick(msg, ['isValid', 'error']) as ValidatedQuery),
					first(),
				)
				.toPromise();
			querySub.send({ id, query });
			return validationP;
		};
	};
};

const SEARCH_SOCKET_ID_GENERATOR = (() => {
	let current = 0;

	return {
		generate: (): number => ++current,
	};
})();

const makeSubscribeToOneQueryValidation = (context: APIContext) => {
	const templatePath = '/api/ws/search';
	const url = buildURL(templatePath, { ...context, protocol: 'ws' });

	return async (
		authToken: string | null,
	): Promise<APISubscription<ValidatedQuery & { id: number }, { id: number; query: Query }>> => {
		const socket = new WebSocket(url, authToken ?? undefined);
		const rawSubscription = apiSubscriptionFromWebSocket<
			RawQueryValidationMessageReceived,
			RawQueryValidationMessageSent
		>(socket);
		rawSubscription.send({ Subs: ['PONG', 'parse', 'search', 'attach'] });

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
			map(msg => ({ id: msg.data.Sequence, query: msg.data.SearchString })),
		);

		const received: Array<ValidatedQuery & { id: number }> = [];
		const sent: Array<{ id: number; query: Query }> = [];

		received$.subscribe(receivedMessage => received.push(receivedMessage));
		sent$.subscribe(sentMessage => sent.push(sentMessage));

		return {
			close: () => rawSubscription.close(),
			send: msg => rawSubscription.send({ type: 'parse', data: { SearchString: msg.query, Sequence: msg.id } }),
			received$,
			received,
			sent$,
			sent,
		};
	};
};

type RawQueryValidationDesiredMessageSent = { type: 'parse'; data: { SearchString: string; Sequence: number } };
type RawQueryValidationMessageSent =
	| RawQueryValidationDesiredMessageSent
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

interface QueryError {
	message: string;
	module: number;
}

export type ValidatedQuery = { isValid: true; error: null } | { isValid: false; error: QueryError };

const toValidatedQuery = (raw: RawValidatedQuery): ValidatedQuery => {
	switch (raw.GoodQuery) {
		case true:
			return {
				isValid: true,
				error: null,
			};
		case false:
			return {
				isValid: false,
				error: {
					message: raw.ParseError ?? 'Unknown error',
					module: raw.ModuleIndex,
				},
			};
	}
};

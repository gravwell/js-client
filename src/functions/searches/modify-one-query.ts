/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isNull, pick } from 'lodash';
import { EMPTY, firstValueFrom, from, Subscription } from 'rxjs';
import { catchError, concatMap, filter, map } from 'rxjs/operators';
import { APIContext } from '~/functions/utils/api-context';
import { Query } from '~/models/query';
import { ElementFilter } from '~/models/search/element-filter';
import { ValidatedQuery } from '~/models/search/validated-query';
import { makeSubscribeToOneQueryParsing } from './subscribe-to-query-parsing';

export const makeModifyOneQuery = (
	context: APIContext,
): ((query: Query, filters: Array<ElementFilter>) => Promise<Query>) => {
	const subscribeToOneQueryParsing = makeSubscribeToOneQueryParsing(context);
	let querySubP: ReturnType<typeof subscribeToOneQueryParsing> | null = null;
	let closedSub: Subscription | null = null;

	return async (query: Query, filters: Array<ElementFilter>): Promise<Query> => {
		if (isNull(querySubP)) {
			querySubP = subscribeToOneQueryParsing();
			if (closedSub?.closed === false) {
				closedSub.unsubscribe();
			}

			// Handles websocket hangups from close or error
			closedSub = from(querySubP)
				.pipe(
					concatMap(rawSubscriptionConcatMap => rawSubscriptionConcatMap.received$),
					catchError(() => EMPTY),
				)
				.subscribe({
					complete: () => {
						querySubP = null;
					},
				});
		}
		const querySub = await querySubP;
		const id = SEARCH_SOCKET_ID_GENERATOR.generate();

		const parsingP = firstValueFrom(
			querySub.received$.pipe(
				filter(msg => msg.id === id),
				map(msg => pick(msg, ['isValid', 'error', 'query']) as ValidatedQuery),
			),
		);
		querySub.send({ id, query, filters });

		const parsed = await parsingP;

		if (parsed.isValid === false) {
			throw new Error(parsed.error.message);
		}
		return parsed.query;
	};
};

const SEARCH_SOCKET_ID_GENERATOR = (() => {
	let current = 0;

	return {
		generate: (): number => ++current,
	};
})();

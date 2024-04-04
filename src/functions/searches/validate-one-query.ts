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
import { Query } from '~/models/query';
import { ValidatedQuery } from '~/models/search/validated-query';
import { APIContext } from '../utils/api-context';
import { makeSubscribeToOneQueryParsing } from './subscribe-to-query-parsing';

export const makeValidateOneQuery = (context: APIContext): ((query: Query) => Promise<ValidatedQuery>) => {
	const subscribeToOneQueryValidation = makeSubscribeToOneQueryParsing(context);
	let querySubP: ReturnType<typeof subscribeToOneQueryValidation> | null = null;
	let closedSub: Subscription | null = null;

	return async (query: Query): Promise<ValidatedQuery> => {
		if (isNull(querySubP)) {
			querySubP = subscribeToOneQueryValidation();
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

		const validationP = firstValueFrom(
			querySub.received$.pipe(
				filter(msg => msg.id === id),
				map(msg => pick(msg, ['isValid', 'error', 'query']) as ValidatedQuery),
			),
		);
		querySub.send({ id, query, filters: [] });
		return validationP;
	};
};

const SEARCH_SOCKET_ID_GENERATOR = (() => {
	let current = 0;

	return {
		generate: (): number => ++current,
	};
})();

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, pick } from 'lodash';
import { filter, first, map } from 'rxjs/operators';
import { APIContext } from '~/functions/utils';
import { ElementFilter, Query, ValidatedQuery } from '~/models';
import { makeSubscribeToOneQueryParsing } from './subscribe-to-query-parsing';

export const makeModifyOneQuery = (context: APIContext) => {
	const subscribeToOneQueryParsing = makeSubscribeToOneQueryParsing(context);
	let querySubP: ReturnType<typeof subscribeToOneQueryParsing> | null = null;

	return async (query: Query, filters: Array<ElementFilter>): Promise<Query> => {
		if (isNull(querySubP)) querySubP = subscribeToOneQueryParsing();
		const querySub = await querySubP;
		const id = SEARCH_SOCKET_ID_GENERATOR.generate();

		const parsingP = querySub.received$
			.pipe(
				filter(msg => msg.id === id),
				map(msg => pick(msg, ['isValid', 'error', 'query']) as ValidatedQuery),
				first(),
			)
			.toPromise();
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

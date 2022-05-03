/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, pick } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Query, ValidatedQuery } from '~/models';
import { APIContext } from '../utils';
import { makeSubscribeToOneQueryParsing } from './subscribe-to-query-parsing';

export const makeValidateOneQuery = (context: APIContext) => {
	const subscribeToOneQueryValidation = makeSubscribeToOneQueryParsing(context);
	let querySubP: ReturnType<typeof subscribeToOneQueryValidation> | null = null;

	return async (query: Query): Promise<ValidatedQuery> => {
		if (isNull(querySubP)) querySubP = subscribeToOneQueryValidation();
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

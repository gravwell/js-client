/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Observable, of, timer } from 'rxjs';
import { catchError, last, mapTo, startWith, takeUntil } from 'rxjs/operators';
import { RawSearchMessageReceived, RawSearchMessageSent } from '~/models';
import { APIContext, APISubscription, apiSubscriptionFromWebSocket, buildURL, WebSocket } from '../utils';

export const makeSubscribeToOneRawSearch = (context: APIContext) => {
	const templatePath = '/api/ws/search';
	const url = buildURL(templatePath, { ...context, protocol: 'ws' });

	return async (): Promise<APISubscription<RawSearchMessageReceived, RawSearchMessageSent>> => {
		const socket = new WebSocket(url, context.authToken ?? undefined);
		const rawSubscription = apiSubscriptionFromWebSocket<RawSearchMessageReceived, RawSearchMessageSent>(socket);

		rawSubscription.send({ Subs: ['PONG', 'parse', 'search', 'attach'] });

		const wsClosed$: Observable<void> = rawSubscription.sent$.pipe(
			startWith(undefined),
			// Even if the websocket hangs up due to an error, we want to emit, so that we can
			// clean up the PONG subscription below
			catchError(() => of(undefined)),
			mapTo(undefined),
			last(),
		);

		timer(1000, 5000)
			.pipe(takeUntil(wsClosed$))
			.subscribe(() => {
				rawSubscription.send({ type: 'PONG', data: {} });
			});

		return rawSubscription;
	};
};

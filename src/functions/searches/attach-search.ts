/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

/** @file Similar to {@link ./initiate-search.ts} but for existing searches. */

import { isNil } from 'lodash';
import { defer, firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { concatMap, delay, filter, first, map, share, withLatestFrom } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {
	RawAttachSearchMessageSent,
	RawSearchAttachedMessageReceived,
	RawSearchMessageReceived,
	RawSearchMessageSent,
} from '~/models';
import { NumericID } from '~/value-objects';
import { APISubscription } from '../utils';

/*
 * A queue of "requests" to attach to searches.
 *
 * Requests are processed one-at-a-time and in-order to mitigate race conditions
 */
const ATTACH_QUEUE = new Subject<{
	requestID: string;
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>;
	searchID: string;
}>();

/*
 * Processes "requests" to attach to searches.
 *
 * "Requests" are processed one-at-a-time and in-order.
 *
 * For each "request":
 *   1. Set up a listener for RawSearchAttachedMessageReceived
 *   2. Send RawAttachSearchMessageSent
 *   3. Wait for listener to receive a RawSearchAttachedMessageReceived
 *   4. When the message is received, proceed to the next "request"
 */
const SEARCH_ATTACH_RESULTS$: Observable<{
	requestID: string;
	msg: RawSearchAttachedMessageReceived;
}> = ATTACH_QUEUE.pipe(
	// When a "request" is received, create an Observable to listen to incoming RawSearchAttachedMessageReceived,
	// and send a RawAttachSearchMessageSent when ready. concatMap ensures we only have one sender/listener at a time.
	// We won't send the next request until we've heard a response for the current request.
	concatMap(({ requestID, rawSubscription, searchID }) =>
		// Listen for incoming messages on the search websocket
		rawSubscription.received$.pipe(
			withLatestFrom(
				// Wait to send RawAttachSearchMessageSent until concatMap has subscribed to the outer Observable
				defer(() =>
					rawSubscription.send({
						type: 'attach',
						data: { ID: searchID },
					} as RawAttachSearchMessageSent),
				),
			),
			// Discard the (void) result from rawSubscription.send(). We only need the messages coming from received$
			map(([msg]) => msg),

			// Filter to only RawSearchAttachedMessageReceived messages
			filter((msg): msg is RawSearchAttachedMessageReceived => {
				try {
					const _msg = msg as RawSearchAttachedMessageReceived;
					// We only check the type so that we don't discard error messages
					// eg. { type: 'attach', data: { Error: 'Search ID is not found' }
					return _msg.type === 'attach';
				} catch {
					return false;
				}
			}),

			// There's only one Received per Sent, so we're done after the first
			first(),

			// Include the internal "request" ID
			map(msg => ({ requestID, msg })),
		),
	),
	share(),
);

export const attachSearch = (
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>,
	searchID: NumericID,
): Promise<RawSearchAttachedMessageReceived> => {
	// Generate a unique ID for the search initiating request
	const requestID = uuidv4();

	// Create a promise to receive search initation results
	const results$ = SEARCH_ATTACH_RESULTS$.pipe(
		// We only want results relevant to this request
		filter(({ requestID: msgRequestID }) => msgRequestID === requestID),

		// There's only one response to the request, so we're done after the first
		first(),

		// If msg.data.Error is nil, the backend is happy  - continue
		// If msg.data.Error is NON-nil, there's a problem - reject
		concatMap(({ msg }) => (isNil(msg.data.Error) ? of(msg) : throwError(new Error(msg.data.Error)))),

		// It takes the backend a fraction of a second to be ready for requests after we set up the search
		delay(200),
	);

	// set up the promise so we can subscribe then next the queue
	const resultsP = firstValueFrom(results$);

	// Now that we're ready to receive results (with resultsP), we can push on the queue to kick off the search initiation process
	ATTACH_QUEUE.next({ requestID, rawSubscription, searchID });

	return resultsP;
};

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil } from 'lodash';
import { defer, Observable, of, Subject, throwError } from 'rxjs';
import { concatMap, delay, filter, first, map, share, tap, withLatestFrom } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {
	RawAcceptSearchMessageSent,
	RawInitiateSearchMessageSent,
	RawSearchInitiatedMessageReceived,
	RawSearchMessageReceived,
	RawSearchMessageSent,
} from '~/models';
import { RawJSON } from '~/value-objects';
import { APISubscription } from '../utils';

/*
 * A queue of "requests" to initiate searches.
 *
 * Requests are processed one-at-a-time and in-order to mitigate race conditions
 */
const QUERY_QUEUE = new Subject<{
	requestID: string;
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>;
	query: string;
	options: InitiateSearchOptions;
}>();

/*
 * Processes "requests" to initate searches.
 *
 * "Requests" are processed one-at-a-time and in-order.
 *
 * For each "request":
 *   1. Set up a listener for RawSearchInitiatedMessageReceived
 *   2. Send RawInitiateSearchMessageSent
 *   3. Wait for listener to receive a RawSearchInitiatedMessageReceived
 *   4. When the message is received, proceed to the next "request"
 */
const QUERY_INIT_RESULTS: Observable<{
	requestID: string;
	msg: RawSearchInitiatedMessageReceived;
}> = QUERY_QUEUE.pipe(
	// When a "request" is received, create an Observable to listen to incoming RawSearchInitiatedMessageReceived,
	// and send a RawInitiateSearchMessageSent when ready. concatMap ensures we only have one sender/listener at a time.
	// We won't send the next request until we've heard a response for the current request.
	concatMap(({ requestID, rawSubscription, query, options }) =>
		// Listen for incoming messages on the search websocket
		rawSubscription.received$.pipe(
			withLatestFrom(
				// Wait to send RawInitiateSearchMessageSent until concatMap has subscribed to the outer Observable
				defer(() => {
					return rawSubscription.send(<RawInitiateSearchMessageSent>{
						type: 'search',
						data: {
							Addendum: options.initialFilterID ? { filterID: options.initialFilterID } : {},
							Background: false,
							Metadata: options.metadata ?? {},
							SearchStart: options.range === 'preview' ? null : options.range?.[0]?.toISOString() ?? null,
							SearchEnd: options.range === 'preview' ? null : options.range?.[1]?.toISOString() ?? null,
							SearchString: query,
							Preview: options.range === 'preview',
							NoHistory: options.noHistory ?? false,
						},
					});
				}),
				// Discard the (void) result from rawSubscription.send(). We only need the messages coming from received$
				(msg: RawSearchMessageReceived) => msg,
			),

			// Filter to only RawSearchInitiatedMessageReceived messages
			filter((msg): msg is RawSearchInitiatedMessageReceived => {
				try {
					const _msg = <RawSearchInitiatedMessageReceived>msg;

					// the type is about all we can count on -- in Error cases, Metadata and Addendum are unavailable.
					return _msg.type === 'search';
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

export type InitiateSearchOptions = {
	range: [Date, Date] | 'preview';
	initialFilterID?: string;
	metadata?: RawJSON;
	noHistory?: boolean;
};

export const initiateSearch = (
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>,
	query: string,
	options: InitiateSearchOptions,
): Promise<RawSearchInitiatedMessageReceived> => {
	// Generate a unique ID for the search initiating request
	const requestID = uuidv4();

	// Create a promise to receive search initation results
	const resultsP = QUERY_INIT_RESULTS.pipe(
		// We only want results relevant to this request
		filter(({ requestID: msgRequestID }) => msgRequestID === requestID),

		// There's only one response to the request, so we're done after the first
		first(),

		// If msg.data.Error is nil, the backend is happy  - continue
		// If msg.data.Error is NON-nil, there's a problem - reject
		concatMap(({ msg }) => (isNil(msg.data.Error) ? of(msg) : throwError(msg))),

		// If we didn't throw, everything is fine. Send a RawAcceptSearchMessageSent to continue setting up the search
		tap(msg =>
			rawSubscription.send(<RawAcceptSearchMessageSent>{
				type: 'search',
				data: { OK: true, OutputSearchSubproto: msg.data.OutputSearchSubproto },
			}),
		),

		// It takes the backend a fraction of a second to be ready for requests after we set up the search
		delay(200),
	).toPromise();

	// Now that we're ready to receive results (with resultsP), we can push on the queue to kick off the search initiation process
	QUERY_QUEUE.next({ requestID, rawSubscription, query, options });

	return resultsP;
};

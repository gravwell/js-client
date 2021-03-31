/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNil } from 'lodash';
import { defer, Observable, of, Subject, throwError } from 'rxjs';
import { concatMap, filter, first, map, share, tap, timeoutWith, withLatestFrom } from 'rxjs/operators';
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
	range: [Date, Date];
	options: { initialFilterID?: string; metadata?: RawJSON };
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
	msg: RawSearchInitiatedMessageReceived | null;
}> = QUERY_QUEUE.pipe(
	// As "requests" are received, create an Observable to listen to incoming RawSearchInitiatedMessageReceived,
	// and send a RawInitiateSearchMessageSent when ready
	concatMap(({ requestID, rawSubscription, query, range, options }) =>
		// Listen for incoming messages on the search websocket
		rawSubscription.received$.pipe(
			withLatestFrom(
				// Wait to send RawInitiateSearchMessageSent until concatMap has subscribed to the outer Observable
				defer(() =>
					rawSubscription.send(<RawInitiateSearchMessageSent>{
						type: 'search',
						data: {
							Addendum: options.initialFilterID ? { filterID: options.initialFilterID } : {},
							Background: false,
							Metadata: options.metadata ?? {},
							SearchStart: range[0].toISOString(),
							SearchEnd: range[1].toISOString(),
							SearchString: query,
						},
					}),
				),
				// Discard the (void) result from rawSubscription.send(). We only need the messages coming from received$
				(msg: RawSearchMessageReceived) => msg,
			),

			// Filter to only RawSearchInitiatedMessageReceived messages with the right requestID
			filter((msg): msg is RawSearchInitiatedMessageReceived => {
				try {
					const _msg = <RawSearchInitiatedMessageReceived>msg;
					return _msg.type === 'search';
				} catch {
					return false;
				}
			}),

			// There's only one Received per Sent, so we're done after the first
			first(),

			// Include the internal "request" ID
			map(msg => {
				return { requestID, msg };
			}),

			// If the backend takes too long, we bail by emitting "null"
			timeoutWith(
				30000,
				defer(() => of({ requestID, msg: null })),
			),
		),
	),
	share(),
);

export const initiateSearch = (
	rawSubscription: APISubscription<RawSearchMessageReceived, RawSearchMessageSent>,
	query: string,
	range: [Date, Date],
	options: { initialFilterID?: string; metadata?: RawJSON } = {},
): Promise<RawSearchInitiatedMessageReceived> => {
	// Generate a unique ID for the search initiating request
	const requestID = uuidv4();

	// Create a promise to receive search initation results
	const resultsP = QUERY_INIT_RESULTS.pipe(
		// We only want results relevant to this request
		filter(({ requestID: msgRequestID }) => msgRequestID === requestID),

		// There's only one response to the request, so we're done after the first
		first(),

		// If msg is null, the search initiation timed out - reject
		// If msg.data.Error is NON-nil, the backend has a problem with the search - reject
		// Otherwise we're good to go
		concatMap(({ msg }) =>
			isNil(msg)
				? throwError({
						name: 'Search Initiation Timed Out',
						message: "Didn't receive a search initiation response from the backend in time.",
				  })
				: !isNil(msg.data.Error)
				? throwError(msg)
				: of(msg),
		),

		// If we didn't throw, everything is fine. Send a RawAcceptSearchMessageSent to continue setting up the search
		tap(msg =>
			rawSubscription.send(<RawAcceptSearchMessageSent>{
				type: 'search',
				data: { OK: true, OutputSearchSubproto: msg.data.OutputSearchSubproto },
			}),
		),
	).toPromise();

	// Now that we're ready to receive results (with resultsP), we can push on the queue to kick off the search initiation process
	QUERY_QUEUE.next({ requestID, rawSubscription, query, range, options });

	return resultsP;
};

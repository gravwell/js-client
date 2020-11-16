/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../models';
import { APIFunctionMakerOptions, APISubscription } from '../utils';
import { makeGetMyNotifications } from './get-my-notifications';

export type MyNotificationsMessageReceived = Array<Notification>;

export type MyNotificationsMessageSent = never;

export const makeSubscribeToMyNotifications = (makerOptions: APIFunctionMakerOptions) => {
	const getMyNotifications = makeGetMyNotifications(makerOptions);

	return async (
		authToken: string | null,
		options: { pollInterval?: number } = { pollInterval: 10000 },
	): Promise<APISubscription<MyNotificationsMessageReceived, MyNotificationsMessageSent>> => {
		const pollInterval = options.pollInterval ?? 10000;

		let timeoutID: ReturnType<typeof setTimeout>;
		const setPoll = () => {
			timeoutID = setTimeout(async () => {
				const notifications = await getMyNotifications(authToken);
				_received$.next(notifications);
				setPoll();
			}, pollInterval);
		};

		const firstNotifications = await getMyNotifications(authToken);
		setPoll();

		const received: Array<MyNotificationsMessageReceived> = [];
		const _received$ = new BehaviorSubject<MyNotificationsMessageReceived>(firstNotifications);
		_received$.subscribe(receivedMessage => received.push(receivedMessage));

		return {
			send: async () => undefined,
			close: () => clearTimeout(timeoutID),
			received,
			received$: _received$.asObservable(),
			sent: [],
			sent$: new Observable<MyNotificationsMessageSent>(),
		};
	};
};

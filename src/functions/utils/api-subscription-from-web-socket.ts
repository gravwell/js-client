/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { APISubscription } from './api-subscription';
import { WebSocket } from './web-socket';

export const apiSubscriptionFromWebSocket = <MessageReceived, MessageSent>(
	socket: WebSocket,
): APISubscription<MessageReceived, MessageSent> => {
	const _received$ = new Subject<MessageReceived>();
	const _sent$ = new Subject<MessageSent>();

	const received: Array<MessageReceived> = [];
	const sent: Array<MessageSent> = [];

	_received$.subscribe(receivedMessage => received.push(receivedMessage));
	_sent$.subscribe(sentMessage => sent.push(sentMessage));

	socket.onmessage = message => {
		_received$.next(JSON.parse(message.data.toString()));
	};

	socket.onerror = err => {
		_received$.error(err);
		_sent$.error(err);
	};

	socket.onclose = () => {
		_received$.complete();
		_sent$.complete();
	};

	const toSend: Array<MessageSent> = [];

	const socketState$ = timer(0, 200).pipe(map(() => getWebSocketState(socket)));
	socketState$.subscribe(state => {
		if (state !== 'open') return;

		while (toSend.length > 0) {
			const message = toSend.shift();
			if (message === undefined) continue;
			const stringMessage = typeof message === 'string' ? message : JSON.stringify(message);
			socket.send(stringMessage);
			_sent$.next(message);
		}
	});

	return {
		send: async message => void toSend.push(message),
		close: () => socket.close(),
		received,
		received$: _received$.asObservable(),
		sent,
		sent$: _sent$.asObservable(),
	};
};

const getWebSocketState = (ws: WebSocket): 'connecting' | 'open' | 'closing' | 'closed' => {
	switch (ws.readyState) {
		case WebSocket.CONNECTING:
			return 'connecting';
		case WebSocket.OPEN:
			return 'open';
		case WebSocket.CLOSING:
			return 'closing';
		case WebSocket.CLOSED:
			return 'closed';
		default:
			return 'closed';
	}
};

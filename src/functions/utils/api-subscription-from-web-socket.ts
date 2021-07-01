/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { from, fromEvent, iif, Subject } from 'rxjs';
import { bufferWhen, concatMap } from 'rxjs/operators';
import { APISubscription } from './api-subscription';
import { WebSocket } from './web-socket';

export const apiSubscriptionFromWebSocket = <MessageReceived, MessageSent>(
	socket: WebSocket,
): APISubscription<MessageReceived, MessageSent> => {
	const _received$ = new Subject<MessageReceived>();
	const _sent$ = new Subject<MessageSent>();
	const _toSend$ = new Subject<MessageSent>();

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
		_toSend$.complete();
	};

	_toSend$
		.pipe(
			// If the socket is still connecting, buffer until the socket is open. Once open, send the buffer through.
			// If the socket is already open, buffer until _toSend$ emits. Since _toSend$ is the source, each buffer contains exactly one item.
			bufferWhen(() => iif(() => getWebSocketState(socket) === 'connecting', fromEvent(socket, 'open'), _toSend$)),

			// Flatten the arrays of messages, so that the Observer gets one message at a time
			concatMap(messages => from(messages)),
		)
		.subscribe(message => {
			if (getWebSocketState(socket) !== 'open') {
				return;
			}

			if (message === undefined) {
				return;
			}
			const stringMessage = typeof message === 'string' ? message : JSON.stringify(message);
			socket.send(stringMessage);
			_sent$.next(message);
		});

	return {
		send: async message => void _toSend$.next(message),
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

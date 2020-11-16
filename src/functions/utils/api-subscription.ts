/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Observable } from 'rxjs';

export interface APISubscription<MessageReceived, MessageSent> {
	send(message: MessageSent): Promise<void>;
	close(): void;
	received: Array<MessageReceived>;
	received$: Observable<MessageReceived>;
	sent: Array<MessageSent>;
	sent$: Observable<MessageSent>;
}

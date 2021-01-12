/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSearchMessageReceived, RawSearchMessageSent } from '../../../models';
import {
	APIFunctionMakerOptions,
	APISubscription,
	apiSubscriptionFromWebSocket,
	buildURL,
	WebSocket,
} from '../../utils';

export const makeSubscribeToOneRawSearch = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/ws/search';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'ws' });

	return async (authToken: string | null): Promise<APISubscription<RawSearchMessageReceived, RawSearchMessageSent>> => {
		const socket = new WebSocket(url, authToken ?? undefined);
		const rawSubscription = apiSubscriptionFromWebSocket<RawSearchMessageReceived, RawSearchMessageSent>(socket);
		rawSubscription.send({ Subs: ['PONG', 'parse', 'search', 'attach'] });
		return rawSubscription;
	};
};

/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { toRawNumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	omitUndefinedShallow,
	parseJSONResponse,
} from '../utils';

export const makeCreateOneBroadcastedNotification = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/notifications/broadcast';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, creatable: CreatableBroadcastNotification): Promise<void> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toCreatableRaw(creatable)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			return parseJSONResponse(raw, { expect: 'void' });
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

export interface CreatableBroadcastNotification {
	message: string;
	customID?: string;

	sentDate?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	expirationDate?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	ignoreUntilDate?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
}

interface RawCreatableBroadcastedNotification {
	Type?: number;
	Broadcast: true;
	Sent?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	Expires?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	IgnoreUntil?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
	Msg: string;
}

const toCreatableRaw = (creatable: CreatableBroadcastNotification): RawCreatableBroadcastedNotification =>
	omitUndefinedShallow({
		Msg: creatable.message,
		Type: creatable.customID === undefined ? undefined : toRawNumericID(creatable.customID),
		Broadcast: true,

		Sent: creatable.sentDate,
		Expires: creatable.expirationDate,
		IgnoreUntil: creatable.ignoreUntilDate,
	});

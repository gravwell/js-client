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

export const makeUpdateOneNotification = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, updatable: UpdatableNotification): Promise<void> => {
		try {
			const templatePath = '/api/notifications/{notificationID}';
			const url = buildURL(templatePath, {
				...makerOptions,
				protocol: 'http',
				pathParams: { notificationID: updatable.id },
			});

			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toUpdatableRaw(updatable)),
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

export interface UpdatableNotification {
	id: string;
	message?: string;
	customID?: string;

	sentDate?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	expirationDate?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	ignoreUntilDate?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
}

interface RawUpdatableNotification {
	Msg?: string;
	Type?: number;
	Sent?: string; // Timestamp eg. '2019-04-22T21:44:01.776942432Z'
	Expires?: string; // Timestamp eg. '2019-04-23T03:44:01.776918756-06:00'
	IgnoreUntil?: string; // Timestamp eg. '0001-01-01T00:00:00Z'
}

const toUpdatableRaw = (updatable: UpdatableNotification): RawUpdatableNotification =>
	omitUndefinedShallow({
		Msg: updatable.message,
		Type: updatable.customID === undefined ? undefined : toRawNumericID(updatable.customID),

		Sent: updatable.sentDate,
		Expires: updatable.expirationDate,
		IgnoreUntil: updatable.ignoreUntilDate,
	});

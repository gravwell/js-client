/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeClearOneScheduledTaskError = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, scheduledTaskID: NumericID): Promise<void> => {
		const templatePath = '/api/scheduledsearches/{scheduledTaskID}/error';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { scheduledTaskID } });

		const baseRequestOptions: HTTPRequestOptions = {
			headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
		};
		const req = buildHTTPRequest(baseRequestOptions);

		const raw = await fetch(url, { ...req, method: 'DELETE' });
		return parseJSONResponse(raw, { expect: 'void' });
	};
};

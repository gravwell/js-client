/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { NumericID } from '~/value-objects';
import { APIContext, buildHTTPRequestWithAuthFromContext, buildURL } from '../utils';

export const makeStopOneSearch =
	(context: APIContext) =>
	async (searchID: NumericID): Promise<void> => {
		const templatePath = '/api/searchctrl/{searchID}/stop';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { searchID } });

		const req = buildHTTPRequestWithAuthFromContext(context);

		await context.fetch(url, { ...req, method: 'PUT' });
	};

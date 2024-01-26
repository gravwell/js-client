/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { ID } from '~/value-objects/id';
import { APIContext } from '../utils/api-context';
import { buildURL } from '../utils/build-url';
import { downloadFromURL, DownloadReturn } from '../utils/download-from-url';

export const makeDownloadOneLocalKit =
	(context: APIContext) =>
	async (kitID: ID): Promise<DownloadReturn> => {
		const templatePath = '/api/kits/build/{kitID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { kitID } });
		return downloadFromURL(url, `kit-${kitID}`);
	};

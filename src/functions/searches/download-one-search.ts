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

export type SearchDownloadFormat = string;

export const makeDownloadOneSearch =
	(context: APIContext) =>
	async (searchID: ID, downloadFormat: SearchDownloadFormat): Promise<DownloadReturn> => {
		const path = '/api/searchctrl/{searchID}/download/{downloadFormat}';
		const url = buildURL(path, { ...context, protocol: 'http', pathParams: { searchID, downloadFormat } });
		const fileName = searchID + '-' + downloadFormat.toLowerCase().replace(/\s/, '-');
		return downloadFromURL(url, fileName);
	};

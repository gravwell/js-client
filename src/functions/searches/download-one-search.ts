/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '../../value-objects';
import { APIFunctionMakerOptions, buildURL, downloadFromURL, DownloadReturn } from '../utils';

export type SearchDownloadFormat = string;

export const makeDownloadOneSearch = (makerOptions: APIFunctionMakerOptions) => {
	return async (
		authToken: string | null,
		searchID: ID,
		downloadFormat: SearchDownloadFormat,
	): Promise<DownloadReturn> => {
		const path = '/api/searchctrl/{searchID}/download/{downloadFormat}';
		const url = buildURL(path, { ...makerOptions, protocol: 'http', pathParams: { searchID, downloadFormat } });
		const fileName = searchID + '-' + downloadFormat.toLowerCase().replace(/\s/, '-');
		return downloadFromURL(url, fileName);
	};
};

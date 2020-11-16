/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '../../value-objects';
import { APIFunctionMakerOptions, buildURL, downloadFromURL, DownloadReturn } from '../utils';

export const makeDownloadOneLocalKit = (makerOptions: APIFunctionMakerOptions) => {
	return async (authToken: string | null, kitID: ID): Promise<DownloadReturn> => {
		const templatePath = '/api/kits/build/{kitID}';
		const url = buildURL(templatePath, { ...makerOptions, protocol: 'http', pathParams: { kitID } });
		return downloadFromURL(url, `kit-${kitID}`);
	};
};

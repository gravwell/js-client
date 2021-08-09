/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '~/value-objects';
import { APIContext, buildURL, downloadFromURL, DownloadReturn } from '../utils';

export const makeDownloadOneLocalKit = (context: APIContext) => {
	return async (kitID: ID): Promise<DownloadReturn> => {
		const templatePath = '/api/kits/build/{kitID}';
		const url = buildURL(templatePath, { ...context, protocol: 'http', pathParams: { kitID } });
		return downloadFromURL(url, `kit-${kitID}`);
	};
};

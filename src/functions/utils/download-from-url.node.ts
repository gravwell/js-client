/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { fetch } from './fetch';

export type DownloadReturn = string;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const downloadFromURL = async (url: string, fileName: string): Promise<DownloadReturn> => {
	const res = await fetch(url);
	return await res.text();
};

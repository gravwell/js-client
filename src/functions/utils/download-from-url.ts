/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

export type DownloadReturn = void;

export const downloadFromURL = async (url: string, fileName: string): Promise<DownloadReturn> => {
	const anchorEl = document.createElement('a');
	anchorEl.href = url;
	anchorEl.setAttribute('download', fileName);

	document.body.appendChild(anchorEl);
	anchorEl.click();
	setTimeout(() => document.body.removeChild(anchorEl), 300);
};

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

export type DownloadReturn = string;

export const downloadFromURL = async (url: string, fileName: string): Promise<DownloadReturn> => {
	const anchorEl = document.createElement('a');
	anchorEl.href = url;
	anchorEl.setAttribute('download', fileName);

	document.body.appendChild(anchorEl);
	anchorEl.click();
	await new Promise(res => setTimeout(res, 300));

	document.body.removeChild(anchorEl);
	return '';
};

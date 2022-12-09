/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { readdirSync, statSync } from 'fs';

/**
 * @param pathName is the path from a folder that we want to see
 * @returns an array with all subfolders inside this folder
 */
export const getSubfoldersFromFolder = (pathName: string): Array<string> => {
	const folderPath = pathName;
	const subFolders = readdirSync(folderPath);
	return subFolders.filter(subfolderName => statSync(`${folderPath}/${subfolderName}`).isDirectory());
};

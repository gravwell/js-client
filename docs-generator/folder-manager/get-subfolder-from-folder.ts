/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { readdirSync } from 'fs';

// This function will return all the subfolders from a folder
export const getSubfoldersFromFolder = (pathName: string): Array<string> => {
	const folder = pathName;
	const subFolders = readdirSync(folder);
	return subFolders.filter(subFolder => !subFolder.includes('.'));
};

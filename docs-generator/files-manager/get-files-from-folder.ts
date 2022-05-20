/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { readdirSync, lstatSync } from 'fs';

/**
 * @param pathName path where is the folder that we wants to see
 * @returns an array with all files inside this folder
 */
export const getFilesFromFolder = (pathName: string): Array<string> => {
	const folder = pathName;
	const files = readdirSync(folder);
	return files.filter(file => file.includes('.'));
};

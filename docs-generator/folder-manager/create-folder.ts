/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/
import { existsSync, mkdirSync } from 'fs';

/**
 * This function will check if this folder exists, and if deosn't it will create a folder on some folderPath
 * @param folderPath is the path where we want to add a new folder
 */
export const createFolder = (folderPath: string): void => {
	!existsSync(folderPath) && mkdirSync(folderPath);
};

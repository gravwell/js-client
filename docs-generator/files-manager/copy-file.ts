/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { copyFileSync, existsSync } from 'fs';

/**
 * This function will make a copy from fileToBeCopyPath, and paste it inside pathWhereFileIsPasted
 * @param pathWhereFileIsCopied is the path where the file is copied from
 * @param pathWhereFileIsPasted is the path whre the file will be copied
 */
export const copyFile = (pathWhereFileIsCopied: string, pathWhereFileIsPasted: string): void => {
	if (existsSync(pathWhereFileIsCopied)) {
		copyFileSync(pathWhereFileIsCopied, pathWhereFileIsPasted);
	} else {
		console.log(`Was not possible to add the code block, ${pathWhereFileIsCopied} does note exists`);
	}
};

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { copyFileSync } from 'fs';

// This function will make a copy from fileToBeCopyPath, and paste it inside pathWhereFileIsPasted
export const copyFile = (pathWhereFileIsCopied: string, pathWhereFileIsPasted: string): void => {
	copyFileSync(pathWhereFileIsCopied, pathWhereFileIsPasted);
};

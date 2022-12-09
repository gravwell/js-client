/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { existsSync, unlinkSync } from 'fs';

/**
 * this function will remove a file from some filePath
 *
 * @param filePath is the path where we want to remove the file
 */
export const removeFile = (filePath: string): void => {
	if (existsSync(filePath)) {
		unlinkSync(`${filePath}`);
	} else {
		console.error(`Was not possible to remove this file, ${filePath} does not exist`);
	}
};

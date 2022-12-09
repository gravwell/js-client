/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { appendFileSync, existsSync } from 'fs';

/**
 * This function will add a code block into some file
 *
 * @param filePath is the path where the code will be added
 * @param code it's the coded to be added
 */
export const addCodeBlock = (filePath: string, code: string): void => {
	if (existsSync(filePath)) {
		appendFileSync(filePath, code);
	} else {
		console.error(`Was not possible to add the code block, ${filePath} does note exist`);
	}
};

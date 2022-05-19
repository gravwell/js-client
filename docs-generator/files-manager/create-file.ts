/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { existsSync, writeFileSync } from 'fs';

/**
 * This function will check if a file with this name exists, and if does not,
 *  it will create a file inside filePath, with the `data` on injected on this file.
 * @param filePath path where the file will be created
 * @param data what will be inject on the file
 */
export const createFile = (filePath: string, data: string): void => {
	!existsSync(filePath) && writeFileSync(filePath, data);
};

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { unlinkSync } from 'fs';

// this function will remove a file from some filePath
export const removeFile = (filePath: string): void => {
	unlinkSync(`${filePath}`);
};

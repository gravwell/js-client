/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { createFolder } from './folder-manager';
import { assetsFolderPathOnDocs, docsFolderPath, pagesFolderPath } from './settings';

export const createAllFolders = (): void => {
	createFolder(docsFolderPath);
	createFolder(pagesFolderPath);
	createFolder(assetsFolderPathOnDocs);
};

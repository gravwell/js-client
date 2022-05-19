/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { copyFile, getFilesFromFolder } from './files-manager';
import {
	assetsFolderPathOnDocs,
	assetsFolderPathOnDocsGenerator,
	homePageFilePathOnDocs,
	homePageFilePathOnDocsGenerator,
} from './settings';

export const copyFiles = (): void => {
	copyHomePageToDocs();
	copyAssetsFilesToDocs();
};

const copyHomePageToDocs = (): void => {
	copyFile(homePageFilePathOnDocsGenerator, homePageFilePathOnDocs);
};

const copyAssetsFilesToDocs = (): void => {
	const filesFromAssetsFolder = getFilesFromFolder(assetsFolderPathOnDocsGenerator);

	filesFromAssetsFolder.forEach((fileName: string) => {
		copyFile(`${assetsFolderPathOnDocsGenerator}/${fileName}`, `${assetsFolderPathOnDocs}/${fileName}`);
	});
};

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

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

/** This function will copy the home-page.html to the docs folder */
const copyHomePageToDocs = (): void => {
	copyFile(homePageFilePathOnDocsGenerator, homePageFilePathOnDocs);
};

/**
 * This function will copy all files from assets folder to the docs/assets
 * folder
 */
const copyAssetsFilesToDocs = (): void => {
	const filesFromAssetsFolder = getFilesFromFolder(assetsFolderPathOnDocsGenerator);

	filesFromAssetsFolder.forEach((fileName: string) => {
		copyFile(`${assetsFolderPathOnDocsGenerator}/${fileName}`, `${assetsFolderPathOnDocs}/${fileName}`);
	});
};

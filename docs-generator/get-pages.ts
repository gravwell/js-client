/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { getSubfoldersFromFolder } from './folder-manager';
import { getFilesFromFolder } from './files-manager';
import { pagesFolderPath, filesFolderPath, readmePathOnDocsGenerator, blackListFolders } from './settings';
import { Page } from './pages';

// This will loop through all folders inside ./src, and will give the correct object
// to typedoc generate the doc correctly

export const getPages = (): Array<Page> => {
	let pages = [];
	const folders = getSubfoldersFromFolder(filesFolderPath);

	folders.forEach(folderName => {
		if (!blackListFolders.includes(folderName)) {
			const folderPath = `${filesFolderPath}/${folderName}`;
			const files = getFilesFromFolder(folderPath);
			const subFolders = getSubfoldersFromFolder(folderPath);

			if (files.length > subFolders.length) {
				pages.push({
					name: folderName,
					entryPointStrategy: 'Expand',
					entryPoints: [folderPath],
					outputDir: `${pagesFolderPath}/${folderName}`,
					readme: `${readmePathOnDocsGenerator}/${folderName}.md`,
				});
			} else {
				pages.push({
					name: folderName,
					entryPointStrategy: 'Resolve',
					entryPoints: getSubfoldersFromFolder(folderPath).map(subfolder => `${folderPath}/${subfolder}`),
					outputDir: `${pagesFolderPath}/${folderName}`,
					readme: `${readmePathOnDocsGenerator}/${folderName}.md`,
				});
			}
		}
	});

	return pages;
};

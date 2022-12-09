/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { getSubfoldersFromFolder } from './folder-manager';
import { getFilesFromFolder } from './files-manager';
import { pagesFolderPath, filesFolderPath, readmePathOnDocsGenerator, blackListFolders } from './settings';
import { Page } from './pages';

/**
 * This function will create a function based on all folders inside './src'
 *
 * @returns all the pages, that will be used inside createTypedocPage()
 */
export const getAllPages = (): Array<Page> => {
	const folders = getSubfoldersFromFolder(filesFolderPath);
	const filteredFolders = folders.filter(folderName => checkIfFolderIsNotOnBlackList(folderName));
	return filteredFolders.map(folderName => getPage(folderName));
};

const checkIfFolderIsNotOnBlackList = (folderName: string): boolean => {
	return !blackListFolders.includes(folderName);
};

const getPage = (folderName: string): Page => {
	const folderPath = `${filesFolderPath}/${folderName}`;
	const files = getFilesFromFolder(folderPath);
	const subFolders = getSubfoldersFromFolder(folderPath);
	const hasMoreFilesThanFolders = files.length > subFolders.length;

	return {
		name: folderName,
		entryPointStrategy: hasMoreFilesThanFolders ? 'expand' : 'resolve',
		entryPoints: hasMoreFilesThanFolders ? [folderPath] : getResolveEntryPoints(folderPath),
		outputDir: `${pagesFolderPath}/${folderName}`,
		readme: `${readmePathOnDocsGenerator}/${folderName}.md`,
		customCss: './docs-generator/assets/custom.css',
	};
};

const getResolveEntryPoints = (folderPath: string): Array<string> => {
	return getSubfoldersFromFolder(folderPath).map(subfolder => `${folderPath}/${subfolder}`);
};

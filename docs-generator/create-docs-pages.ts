/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { addCodeBlock, getFilesFromFolder, removeFile } from './files-manager';
import { getSubfoldersFromFolder } from './folder-manager';
import { Page } from './pages';
import { docsFolderPath } from './settings';
import {
	removeModulesLinksScript,
	setBreadCrumbScript,
	setNavbarLinkScript,
	setSideBarScript,
	setTitleScript,
} from './scripts';
import { createTypedocPage } from './typedoc';

export const createDocsPages = async (pages: Array<Page>): Promise<void> => {
	pages.forEach(async (page: Page, index: number) => {
		await createTypedocPage<Page>(page);
		setPages(page, index);
	});
};

const setPages = (page: Page, index: number): void => {
	setHomePage(page, index);
	setIndexPage(page);
	setChildPage(page);
	removeFile(`${page.outputDir}/modules.html`);
};

const setHomePage = (page: Page, index: number): void => {
	const homePageScript = getHomePageScript(page, index);
	addCodeBlock(`${docsFolderPath}/index.html`, homePageScript);
};

const setIndexPage = (page: Page): void => {
	const indexPageScript = getIndexPageScript(page);
	addCodeBlock(`${page.outputDir}/index.html`, indexPageScript);
};

const setChildPage = (page: Page): void => {
	const folder = page.outputDir;
	const subFolders = getSubfoldersFromFolder(folder);

	subFolders.forEach((subFolder: string) => {
		const files = getFilesFromFolder(`${folder}/${subFolder}`);

		files.forEach((fileName: string) => {
			if (fileName.includes('.html')) {
				const filePath = `${folder}/${subFolder}/${fileName}`;
				const childPageScript = getChildPageScript(page);
				addCodeBlock(filePath, childPageScript);
			}
		});
	});
};

/**
 * This will change the homePage sideBar, and add all the links from the pages created
 * @param page will be used inside setSideBarScript(), checkout set-sidebar-script.ts for more informations
 * @param index will be used inside setSideBarScript(), checkout set-sidebar-script.ts for more informations
 * @returns the script to be able to change the homePage sidebar
 */
const getHomePageScript = (page: Page, index: number): string => {
	return setSideBarScript(page, index);
};

/**
 * @param page the page where this script will be addded
 * @returns the script to make changes on index pages
 */
const getIndexPageScript = (page: Page): string => {
	return `
	${setNavbarLinkScript('../../index.html')}
	${removeModulesLinksScript('document.getElementsByClassName("current")[0].children[0]')}
	${setTitleScript('document.getElementsByClassName("container")[1].children[0]', page.name)}
	`;
};

/**
 * @param page the page where this script will be addded
 * @returns it will get the script that will make changes on all childPages
 * childPages: all the pages that's not index.html, ex: ./docs/pages/functions/modules/actionables.html
 */
const getChildPageScript = (page: Page): string => {
	return `
	${setNavbarLinkScript('../../../index.html')}
	${removeModulesLinksScript('document.getElementsByClassName("primary")[0].children[0].children[0]')}
	${setBreadCrumbScript('document.getElementsByClassName("tsd-breadcrumb")[0].children[0].children[0]', page.name)}
	`;
};

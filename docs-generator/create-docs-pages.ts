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

export const createDocsPages = (pages: Array<Page>): void => {
	pages.forEach((page: Page, index: number) => {
		createTypedocPage<Page>(page).then(() => setPages(page, index));
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

// This will change the homePage sideBar
const getHomePageScript = (page: Page, index: number): string => {
	return setSideBarScript(page, index);
};

// This will add a script inside all index pages (unless the homePage),
// it will make the navbar link points to the homePage
// then will remove the modules link created by default by typedoc
// it will change the title page, created by default by typedoc
const getIndexPageScript = (page: Page): string => {
	return `
	${setNavbarLinkScript('../../index.html')}
	${removeModulesLinksScript('document.getElementsByClassName("current")[0].children[0]')}
	${setTitleScript('document.getElementsByClassName("container")[1].children[0]', page.name)}
	`;
};

// This will add a script inside all child pages, ex: ./docs/pages/functions/modules/actionables.html
// it will make the navbar link points to the homePage
// then will remove the modules link created by default by typedoc
// it will change the breadCrumb, created by default by typedoc
const getChildPageScript = (page: Page): string => {
	return `
	${setNavbarLinkScript('../../../index.html')}
	${removeModulesLinksScript('document.getElementsByClassName("primary")[0].children[0].children[0]')}
	${setBreadCrumbScript('document.getElementsByClassName("tsd-breadcrumb")[0].children[0].children[0]', page.name)}
	`;
};

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { Page } from './pages';
import { markDownLicense, readmePathOnDocsGenerator } from './settings';
import { createFile } from './files-manager';

export const createReadmes = (pages: Array<Page>): void => {
	pages.forEach(page => {
		const readmeFilePath = `${readmePathOnDocsGenerator}/${page.name}.md`;
		createFile(readmeFilePath, markDownLicense);
	});
};

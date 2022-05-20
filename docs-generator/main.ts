/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { createAllFolders } from './create-folders';
import { copyFiles } from './copy-files';
import { getPages } from './get-pages';
import { createReadmes } from './create-readmes';
import { createDocsPages } from './create-docs-pages';

createAllFolders();
copyFiles();

const pages = getPages();
createReadmes(pages);
createDocsPages(pages);

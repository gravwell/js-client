/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeCreateOneFile } from '~/functions/files/create-one-file';
import { makeDeleteOneFile } from '~/functions/files/delete-one-file';
import { makeGetAllFiles } from '~/functions/files/get-all-files';
import { makeGetFilesAuthorizedToMe } from '~/functions/files/get-files-authorized-to-me';
import { makeUpdateOneFile } from '~/functions/files/update-one-file';
import { APIContext } from '~/functions/utils/api-context';
import { makeGetOneFileDetails } from '../../functions/files/get-one-file-details';
import { FilesService } from './service';

export const createFilesService = (context: APIContext): FilesService => ({
	get: {
		one: makeGetOneFileDetails(context),
		all: makeGetAllFiles(context),
		authorizedTo: {
			me: makeGetFilesAuthorizedToMe(context),
		},
	},

	create: {
		one: makeCreateOneFile(context),
	},

	update: {
		one: makeUpdateOneFile(context),
	},

	delete: {
		one: makeDeleteOneFile(context),
	},
});

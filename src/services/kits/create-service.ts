/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import {
	makeBuildOneLocalKit,
	makeDownloadOneLocalKit,
	makeDownloadRemoteKit,
	makeGetAllLocalKits,
	makeGetAllRemoteKits,
	makeGetOneLocalKit,
	makeGetOneRemoteKit,
	makeInstallOneKit,
	makeUninstallAllKits,
	makeUninstallOneKit,
	makeUploadOneLocalKit,
	makeUploadOneRemoteKit,
} from '~/functions/kits';
import { APIContext } from '~/functions/utils';
import { KitsService } from './service';

export const createKitsService = (context: APIContext): KitsService => ({
	get: {
		one: {
			local: makeGetOneLocalKit(context),
			remote: makeGetOneRemoteKit(context),
		},
		all: {
			local: makeGetAllLocalKits(context),
			remote: makeGetAllRemoteKits(context),
		},
	},

	build: {
		one: {
			local: makeBuildOneLocalKit(context),
		},
	},

	upload: {
		one: {
			local: makeUploadOneLocalKit(context),
			remote: makeUploadOneRemoteKit(context),
		},
	},

	download: {
		one: {
			local: makeDownloadOneLocalKit(context),
			remote: makeDownloadRemoteKit(context),
		},
	},

	install: {
		one: makeInstallOneKit(context),
	},

	uninstall: {
		one: makeUninstallOneKit(context),
		all: makeUninstallAllKits(context),
	},
});

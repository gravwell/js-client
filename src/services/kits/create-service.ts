/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeBuildOneLocalKit } from '~/functions/kits/build-one-local-kit';
import { makeDeleteOneKitArchive } from '~/functions/kits/delete-one-archive';
import { makeDeleteOneLocalKit } from '~/functions/kits/delete-one-local-kit';
import { makeDownloadOneLocalKit } from '~/functions/kits/download-one-local-kit';
import { makeDownloadRemoteKit } from '~/functions/kits/download-one-remote-kit';
import { makeGetKitArchives } from '~/functions/kits/get-all-archives';
import { makeGetAllLocalKits } from '~/functions/kits/get-all-local-kits';
import { makeGetAllRemoteKits } from '~/functions/kits/get-all-remote-kits';
import { makeGetOneLocalKit } from '~/functions/kits/get-one-local-kit';
import { makeGetOneRemoteKit } from '~/functions/kits/get-one-remote-kit';
import { makeInstallOneKit } from '~/functions/kits/install-one-kit';
import { makeStageOneRemoteKit } from '~/functions/kits/stage-one-kit';
import { makeUninstallAllKits } from '~/functions/kits/uninstall-all-kits';
import { makeUninstallOneKit } from '~/functions/kits/uninstall-one-kit';
import { makeUploadOneLocalKit } from '~/functions/kits/upload-one-local-kit';
import { makeUploadOneRemoteKit } from '~/functions/kits/upload-one-remote-kit';
import { APIContext } from '~/functions/utils/api-context';
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

	stage: {
		one: makeStageOneRemoteKit(context),
	},

	install: {
		one: makeInstallOneKit(context),
	},

	uninstall: {
		one: makeUninstallOneKit(context),
		all: makeUninstallAllKits(context),
	},

	delete: {
		one: makeDeleteOneLocalKit(context),
	},

	archives: {
		get: {
			all: makeGetKitArchives(context),
		},
		delete: {
			one: makeDeleteOneKitArchive(context),
		},
	},
});

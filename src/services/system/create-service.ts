/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { makeBackup } from '~/functions/system/backup';
import { makeGetAPIVersion } from '~/functions/system/get-api-version';
import { makeGetSystemSettings } from '~/functions/system/get-system-settings';
import { makeRestore } from '~/functions/system/restore';
import { makeSubscribeToManySystemInformations } from '~/functions/system/subscribe-to-many-system-informations';
import { makeSystemIsConnected } from '~/functions/system/system-is-connected';
import { APIContext } from '~/functions/utils/api-context';
import { SystemService } from './service';

export const createSystemService = (context: APIContext): SystemService => ({
	subscribeTo: {
		information: makeSubscribeToManySystemInformations(context),
	},

	get: {
		settings: makeGetSystemSettings(context),
		apiVersion: makeGetAPIVersion(context),
	},

	is: {
		connected: makeSystemIsConnected(context),
	},

	backup: makeBackup(context),

	restore: makeRestore(context),
});

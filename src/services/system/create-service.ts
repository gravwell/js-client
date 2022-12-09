/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import {
	makeBackup,
	makeGetAPIVersion,
	makeGetSystemSettings,
	makeRestore,
	makeSubscribeToManySystemInformations,
	makeSystemIsConnected,
} from '~/functions/system';
import { APIContext } from '~/functions/utils';
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

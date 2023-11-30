/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { GetAPIVersionResponse } from '~/functions/system/get-api-version';
import {
	SystemStatusCategory,
	SystemStatusMessageReceived,
	SystemStatusMessageSent,
} from '~/functions/system/subscribe-to-many-system-informations';
import { APISubscription } from '~/functions/utils/api-subscription';
import { SystemSettings } from '~/models/system-settings';

export interface SystemService {
	readonly subscribeTo: {
		readonly information: (
			statusCategories: Array<SystemStatusCategory>,
		) => Promise<APISubscription<SystemStatusMessageReceived, SystemStatusMessageSent>>;
	};

	readonly get: {
		readonly settings: () => Promise<SystemSettings>;
		readonly apiVersion: () => Promise<GetAPIVersionResponse>;
	};

	readonly is: {
		readonly connected: () => Promise<boolean>;
	};

	readonly backup: (includeSavedSearches: boolean) => Promise<File>;

	readonly restore: (backup: File, signal?: AbortSignal) => Promise<void>;
}

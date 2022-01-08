/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawSystemSettings } from './raw-system-settings';
import { SystemSettings } from './system-settings';

export const toSystemSettings = (raw: RawSystemSettings): SystemSettings => ({
	mapTileURL: raw.MapTileUrl,
	disableMapTileProxy: raw.DisableMapTileProxy,
	webServerIsDistributed: raw.DistributedWebservers,
	maxFileSize: raw.MaxFileSize,
	maxResourceSize: raw.MaxResourceSize,
});

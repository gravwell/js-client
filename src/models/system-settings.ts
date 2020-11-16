/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isInteger, isString } from 'lodash';

export interface RawSystemSettings {
	DisableMapTileProxy: boolean;
	DistributedWebservers: boolean;
	MapTileUrl: string;
	MaxFileSize: number;
	MaxResourceSize: number;
}

export interface SystemSettings {
	mapTileURL: string;
	disableMapTileProxy: boolean;

	webServerIsDistributed: boolean;

	maxFileSize: number;
	maxResourceSize: number;
}

export const toSystemSettings = (raw: RawSystemSettings): SystemSettings => ({
	mapTileURL: raw.MapTileUrl,
	disableMapTileProxy: raw.DisableMapTileProxy,
	webServerIsDistributed: raw.DistributedWebservers,
	maxFileSize: raw.MaxFileSize,
	maxResourceSize: raw.MaxResourceSize,
});

export const isSystemSettings = (value: any): value is SystemSettings => {
	try {
		const s = <SystemSettings>value;
		return (
			isString(s.mapTileURL) &&
			isBoolean(s.disableMapTileProxy) &&
			isBoolean(s.webServerIsDistributed) &&
			isInteger(s.maxFileSize) &&
			isInteger(s.maxResourceSize)
		);
	} catch {
		return false;
	}
};

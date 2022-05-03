/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isInteger, isString } from 'lodash';
import { SystemSettings } from './system-settings';

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

/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isID, isNumericID, isUUID } from '~/value-objects';
import { isVersion } from '../version';
import { isKitItem } from './kit-item';
import { LocalKitData } from './local-kit-data';

export const isLocalKitData = (v: unknown): v is LocalKitData => {
	try {
		const k = <LocalKitData>v;
		return (
			isID(k.customID) &&
			isUUID(k.globalID) &&
			isNumericID(k.userID) &&
			k.groupIDs.every(isNumericID) &&
			isString(k.name) &&
			isString(k.description) &&
			k.labels.every(isString) &&
			isDate(k.installationDate) &&
			isVersion(k.version) &&
			isVersion(k.gravwellCompatibility.min) &&
			isVersion(k.gravwellCompatibility.max) &&
			['installed', 'uploaded'].includes(k.status) &&
			isBoolean(k.isSigned) &&
			isBoolean(k.requiresAdminPrivilege) &&
			k.items.every(isKitItem) &&
			k.configMacros.every(
				s =>
					isString(s.macroName) &&
					isString(s.description) &&
					isString(s.defaultValue) &&
					(isString(s.value) || (isNull(s.value) && ['tag', 'string'].includes(s.type))),
			)
		);
	} catch {
		return false;
	}
};

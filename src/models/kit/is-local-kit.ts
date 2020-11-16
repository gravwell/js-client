/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID } from '../../value-objects';
import { isVersion } from '../version';
import { isKitItem } from './kit-item';
import { LocalKit } from './local-kit';

export const isLocalKit = (v: any): v is LocalKit => {
	try {
		const k = <LocalKit>v;
		return (
			isUUID(k.customID) &&
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
				['installed', 'uploaded'].includes(k.status),
			isBoolean(k.isSigned) &&
				isBoolean(k.requiresAdminPrivilege) &&
				k.items.every(isKitItem) &&
				k.settings.every(
					s =>
						s.type === 'macro value' &&
						isString(s.name) &&
						isString(s.description) &&
						isString(s.defaultValue) &&
						(isString(s.value) || (isNull(s.value) && ['tag', 'string'].includes(s.valueType))),
				)
		);
	} catch {
		return false;
	}
};

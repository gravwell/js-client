/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNumber, isString } from 'lodash';
import { isUUID } from '~/value-objects';
import { isVersion } from '../version';
import { isKitAsset } from './kit-asset';
import { isKitDependency } from './kit-dependency';
import { isKitItem } from './kit-item';
import { RemoteKitData } from './remote-kit-data';

export const isRemoteKitData = (v: unknown): v is RemoteKitData => {
	try {
		const k = <RemoteKitData>v;
		return (
			isUUID(k.customID) &&
			isUUID(k.globalID) &&
			isString(k.name) &&
			isString(k.description) &&
			k.labels.every(isString) &&
			isDate(k.creationDate) &&
			isVersion(k.version) &&
			isVersion(k.gravwellCompatibility.min) &&
			isVersion(k.gravwellCompatibility.max) &&
			isNumber(k.size) &&
			k.ingesters.every(isString) &&
			isBoolean(k.isSigned) &&
			isBoolean(k.requiresAdminPrivilege) &&
			k.assets.every(isKitAsset) &&
			k.dependencies.every(isKitDependency) &&
			k.items.every(isKitItem)
		);
	} catch {
		return false;
	}
};

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isID, isNumericID, isUUID } from '~/value-objects';
import { isVersion } from '../version';
import { isKitAsset } from './kit-asset';
import { isKitItem } from './kit-item';
import { LocalKitData, LocalKitDependency } from './local-kit-data';

export const isLocalKitData = (v: unknown): v is LocalKitData => {
	try {
		const k = v as LocalKitData;
		return (
			isID(k.customID) &&
				isUUID(k.globalID) &&
				isNumericID(k.userID) &&
				(isNull(k.groupID) || isNumericID(k.groupID)) &&
				isString(k.name) &&
				isString(k.description) &&
				k.labels.every(isString) &&
				(isNull(k.readme) || isString(k.readme)) &&
				(isNull(k.bannerID) || isString(k.bannerID)) &&
				(isNull(k.coverID) || isString(k.coverID)) &&
				(isNull(k.iconID) || isString(k.iconID)) &&
				isDate(k.installationDate) &&
				isVersion(k.version) &&
				isVersion(k.gravwellCompatibility.min) &&
				isVersion(k.gravwellCompatibility.max) &&
				['installed', 'uploaded'].includes(k.status) &&
				isBoolean(k.isSigned) &&
				isBoolean(k.requiresAdminPrivilege) &&
				k.items.every(isKitItem) &&
				k.modifiedItems.every(isKitItem) &&
				k.conflictingItems.every(isKitItem) &&
				k.configMacros.every(
					s =>
						isString(s.macroName) &&
						isString(s.description) &&
						isString(s.defaultValue) &&
						(isString(s.value) || (isNull(s.value) && ['tag', 'string'].includes(s.type))),
				),
			k.requiredDependencies.every(isLocalKitDependency)
		);
	} catch {
		return false;
	}
};

export const isLocalKitDependency = (value: unknown): value is LocalKitDependency => {
	try {
		const k = value as LocalKitDependency;

		return (
			isID(k.customID) &&
			isUUID(k.globalID) &&
			isString(k.name) &&
			isString(k.description) &&
			isVersion(k.version) &&
			isVersion(k.gravwellCompatibility.min) &&
			isVersion(k.gravwellCompatibility.max) &&
			isDate(k.createdDate) &&
			isBoolean(k.isSigned) &&
			isBoolean(k.requiresAdminPrivilege) &&
			k.tags.every(isString) &&
			k.ingesters.every(isString) &&
			k.assets.every(isKitAsset) &&
			k.items.every(isKitItem)
		);
	} catch {
		return false;
	}
};

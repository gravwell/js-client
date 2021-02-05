/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, isNumber, isString } from 'lodash';
import { isUUID, UUID } from '~/value-objects';
import { isVersion, Version } from '../version';

export interface KitItemBase {
	name: string;
	hash: Array<number>;
}

export interface FileKitItem extends KitItemBase {
	type: 'file';
	globalID: UUID;
	description: string | null;
	size: number;
	contentType: string;
}

export interface DashboardKitItem extends KitItemBase {
	type: 'dashboard';
	globalID: UUID;
	description: string | null;
}

export interface LicenseKitItem extends KitItemBase {
	type: 'license';
	license: string;
}

export interface MacroKitItem extends KitItemBase {
	type: 'macro';
	expansion: string;
}

export interface ActionableKitItem extends KitItemBase {
	type: 'actionable';
	globalID: UUID;
	description: string | null;
}

export interface PlaybookKitItem extends KitItemBase {
	type: 'playbook';
	globalID: UUID;
	description: string | null;
}

export interface ResourceKitItem extends KitItemBase {
	type: 'resource';
	description: string;
	size: number;
	version: Version;
}

export interface ScheduledScriptKitItem extends KitItemBase {
	type: 'scheduled script';
	description: string | null;
	schedule: string;
	script: string;
}

export interface SavedQueryKitItem extends KitItemBase {
	type: 'saved query';
	description: string | null;
	query: string;
}

export interface TemplateKitItem extends KitItemBase {
	type: 'template';
	globalID: UUID;
	description: string | null;
}

export type KitItem =
	| FileKitItem
	| DashboardKitItem
	| LicenseKitItem
	| MacroKitItem
	| ActionableKitItem
	| PlaybookKitItem
	| ResourceKitItem
	| ScheduledScriptKitItem
	| SavedQueryKitItem
	| TemplateKitItem;

export const isKitItem = (v: any): v is KitItem => {
	try {
		const i = <KitItem>v;
		const base = i.hash.every(isNumber) && isString(i.name);
		if (base === false) return false;

		switch (i.type) {
			case 'file':
				return (
					isUUID(i.globalID) &&
					(isString(i.description) || isNull(i.description)) &&
					isNumber(i.size) &&
					isString(i.contentType)
				);
			case 'dashboard':
				return isUUID(i.globalID) && (isString(i.description) || isNull(i.description));
			case 'license':
				return isString(i.license);
			case 'macro':
				return isString(i.expansion);
			case 'actionable':
				return isUUID(i.globalID) && (isString(i.description) || isNull(i.description));
			case 'playbook':
				return isUUID(i.globalID) && isString(i.description) && isNull(i.description);
			case 'resource':
				return isString(i.description) && isNumber(i.size) && isVersion(i.version);
			case 'scheduled script':
				return (isString(i.description) || isNull(i.description)) && isString(i.schedule) && isString(i.script);
			case 'saved query':
				return (isString(i.description) || isNull(i.description)) && isString(i.query);
			case 'template':
				return isUUID(i.globalID) && (isString(i.description) || isNull(i.description));
			default:
				return false;
		}
	} catch {
		return false;
	}
};

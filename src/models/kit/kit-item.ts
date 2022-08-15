/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNull, isNumber, isString } from 'lodash';
import { isUUID, UUID } from '~/value-objects';
import { AutoExtractorModule } from '..';
import { isVersion, Version } from '../version';

export interface KitItemBase {
	name: string;
	hash: Array<number>;
}

export interface LicenseKitItem extends KitItemBase {
	type: 'license';
	license: string;
}

export interface FileKitItem extends KitItemBase {
	id: string;
	type: 'file';
	globalID: UUID;
	description: string | null;
	size: number;
	contentType: string;
}

export interface DashboardKitItem extends KitItemBase {
	id: string;
	type: 'dashboard';
	globalID: UUID;
	description: string | null;
}

export interface MacroKitItem extends KitItemBase {
	id: string;
	type: 'macro';
	description: string | null;
	expansion: string;
}

export interface ActionableKitItem extends KitItemBase {
	id: string;
	type: 'actionable';
	globalID: UUID;
	description: string | null;
}

export interface PlaybookKitItem extends KitItemBase {
	id: string;
	type: 'playbook';
	globalID: UUID;
	description: string | null;
}

export interface ResourceKitItem extends KitItemBase {
	id: string;
	type: 'resource';
	description: string;
	size: number;
	version: Version;
}

export interface ScheduledScriptKitItem extends KitItemBase {
	id: string;
	type: 'scheduled script';
	description: string;
	schedule: string;
	script: string;
	oneShot: boolean;
	isDisabled: boolean;
}

export interface ScheduledQueryKitItem extends KitItemBase {
	id: string;
	type: 'scheduled query';
	description: string;
	schedule: string;
	query: string;
	oneShot: boolean;
	isDisabled: boolean;
}

export interface SavedQueryKitItem extends KitItemBase {
	id: string;
	type: 'saved query';
	globalID: UUID;
	description: string | null;
	query: string;
}

export interface TemplateKitItem extends KitItemBase {
	id: string;
	type: 'template';
	globalID: UUID;
	description: string | null;
}

export interface AutoExtractorKitItem extends KitItemBase {
	id: string;
	type: 'auto extractor';
	description: string;
	module: AutoExtractorModule;
	tag: string;
}

export type KitItem =
	| LicenseKitItem
	| FileKitItem
	| DashboardKitItem
	| MacroKitItem
	| ActionableKitItem
	| PlaybookKitItem
	| ResourceKitItem
	| ScheduledScriptKitItem
	| ScheduledQueryKitItem
	| SavedQueryKitItem
	| TemplateKitItem
	| AutoExtractorKitItem;

export const isKitItem = (v: any): v is KitItem => {
	try {
		const i = v as KitItem;
		const base = i.hash.every(isNumber) && isString(i.name);
		if (base === false) {
			return false;
		}

		switch (i.type) {
			case 'license':
				return isString(i.license);
			case 'file':
				return (
					isString(i.id) &&
					isUUID(i.globalID) &&
					(isString(i.description) || isNull(i.description)) &&
					isNumber(i.size) &&
					isString(i.contentType)
				);
			case 'dashboard':
				return isString(i.id) && isUUID(i.globalID) && (isString(i.description) || isNull(i.description));
			case 'macro':
				return isString(i.id) && isString(i.expansion) && (isString(i.description) || isNull(i.description));
			case 'actionable':
				return isString(i.id) && isUUID(i.globalID) && (isString(i.description) || isNull(i.description));
			case 'playbook':
				return isString(i.id) && isUUID(i.globalID) && (isString(i.description) || isNull(i.description));
			case 'resource':
				return isString(i.id) && isString(i.description) && isNumber(i.size) && isVersion(i.version);
			case 'scheduled script':
				return (
					isString(i.id) &&
					isString(i.description) &&
					isString(i.schedule) &&
					isString(i.script) &&
					isBoolean(i.oneShot) &&
					isBoolean(i.isDisabled)
				);
			case 'scheduled query':
				return (
					isString(i.id) &&
					isString(i.description) &&
					isString(i.schedule) &&
					isString(i.query) &&
					isBoolean(i.oneShot) &&
					isBoolean(i.isDisabled)
				);
			case 'saved query':
				return (
					isString(i.id) &&
					isUUID(i.globalID) &&
					(isString(i.description) || isNull(i.description)) &&
					isString(i.query)
				);
			case 'template':
				return isString(i.id) && isUUID(i.globalID) && (isString(i.description) || isNull(i.description));
			case 'auto extractor':
				return isString(i.id) && isString(i.description) && isString(i.tag) && isString(i.module);
			default:
				throw Error(`Unexpected KitItem.type`);
		}
	} catch {
		return false;
	}
};

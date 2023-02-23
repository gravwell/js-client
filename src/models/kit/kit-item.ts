/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isNull, isNumber, isString } from 'lodash';
import { isUUID, UUID } from '~/value-objects';
import { AutoExtractorModule } from '..';
import { isVersion, Version } from '../version';

export interface KitItemBase {
	id: string | null; // Just exist on LocalKit assets
	name: string;
	hash: Array<number>;
}

export enum KIT_ITEM_TYPE {
	license = 'license',
	file = 'file',
	dashboard = 'dashboard',
	macro = 'macro',
	actionable = 'actionable',
	playbook = 'playbook',
	resource = 'resource',
	scheduledScript = 'scheduled script',
	scheduledQuery = 'scheduled query',
	savedQuery = 'saved query',
	template = 'template',
	flow = 'flow',
	autoExtractor = 'auto extractor',
}

export interface LicenseKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.license;
	license: string;
}

export interface FileKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.file;
	globalID: UUID;
	description: string | null;
	size: number;
	contentType: string;
}

export interface DashboardKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.dashboard;
	globalID: UUID;
	description: string | null;
}

export interface MacroKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.macro;
	description: string | null;
	expansion: string;
}

export interface ActionableKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.actionable;
	globalID: UUID;
	description: string | null;
}

export interface PlaybookKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.playbook;
	globalID: UUID;
	description: string | null;
}

export interface ResourceKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.resource;
	description: string;
	size: number;
	version: Version;
}

export interface ScheduledScriptKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.scheduledScript;
	description: string;
	schedule: string;
	script: string;
	oneShot: boolean;
	isDisabled: boolean;
}

export interface ScheduledQueryKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.scheduledQuery;
	description: string;
	schedule: string;
	query: string;
	duration: number | null;
	oneShot: boolean;
	isDisabled: boolean;
}

export interface SavedQueryKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.savedQuery;
	globalID: UUID;
	description: string | null;
	query: string;
}

export interface TemplateKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.template;
	globalID: UUID;
	description: string | null;
}

export interface FlowKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.flow;
	description: string | null;
}

export interface AutoExtractorKitItem extends KitItemBase {
	type: KIT_ITEM_TYPE.autoExtractor;
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
	| FlowKitItem
	| AutoExtractorKitItem;

export const isKitItem = (value: unknown): value is KitItem => {
	try {
		const kitItem = value as KitItem;
		const base = (isNull(kitItem.id) || isString(kitItem.id)) && kitItem.hash.every(isNumber) && isString(kitItem.name);
		if (base === false) {
			return false;
		}

		switch (kitItem.type) {
			case 'license':
				return isString(kitItem.license);
			case 'file':
				return (
					isUUID(kitItem.globalID) &&
					(isString(kitItem.description) || isNull(kitItem.description)) &&
					isNumber(kitItem.size) &&
					isString(kitItem.contentType)
				);
			case 'dashboard':
				return isUUID(kitItem.globalID) && (isString(kitItem.description) || isNull(kitItem.description));
			case 'macro':
				return isString(kitItem.expansion) && (isString(kitItem.description) || isNull(kitItem.description));
			case 'actionable':
				return isUUID(kitItem.globalID) && (isString(kitItem.description) || isNull(kitItem.description));
			case 'playbook':
				return isUUID(kitItem.globalID) && (isString(kitItem.description) || isNull(kitItem.description));
			case 'resource':
				return isString(kitItem.description) && isNumber(kitItem.size) && isVersion(kitItem.version);
			case 'scheduled script':
				return (
					isString(kitItem.description) &&
					isString(kitItem.schedule) &&
					isString(kitItem.script) &&
					isBoolean(kitItem.oneShot) &&
					isBoolean(kitItem.isDisabled)
				);
			case 'scheduled query':
				return (
					isString(kitItem.description) &&
					isString(kitItem.schedule) &&
					isString(kitItem.query) &&
					isBoolean(kitItem.oneShot) &&
					isBoolean(kitItem.isDisabled)
				);
			case 'saved query':
				return (
					isUUID(kitItem.globalID) &&
					(isString(kitItem.description) || isNull(kitItem.description)) &&
					isString(kitItem.query)
				);
			case 'template':
				return isUUID(kitItem.globalID) && (isString(kitItem.description) || isNull(kitItem.description));
			case 'flow':
				return isString(kitItem.name);
			case 'auto extractor':
				return isString(kitItem.description) && isString(kitItem.tag) && isString(kitItem.module);
			default:
				throw Error(`Unexpected KitItem.type`);
		}
	} catch {
		return false;
	}
};

export const kitItemHasGlobalID = (value: unknown): value is KitItem & { globalID: string } => {
	try {
		const kitItem = value as KitItem;
		switch (kitItem.type) {
			case 'file':
				return isUUID(kitItem.globalID);
			case 'dashboard':
				return isUUID(kitItem.globalID);
			case 'macro':
				return isString(kitItem.expansion);
			case 'actionable':
				return isUUID(kitItem.globalID);
			case 'playbook':
				return isUUID(kitItem.globalID);
			case 'saved query':
				return isUUID(kitItem.globalID);
			case 'template':
				return isUUID(kitItem.globalID);
			default:
				return false;
		}
	} catch {
		return false;
	}
};

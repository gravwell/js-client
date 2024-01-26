/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { omitUndefinedShallow } from '../../functions/utils/omit-undefined-shallow';
import { KIT_ITEM_TYPE, KitItem } from './kit-item';
import { RawKitItem, RawKitItemBase } from './raw-kit-item';

export const toRawKitItem = (kitItem: KitItem): RawKitItem => {
	const base: RawKitItemBase = {
		ID: kitItem.id ?? undefined,
		Name: kitItem.name,
		Hash: kitItem.hash,
	};
	switch (kitItem.type) {
		case KIT_ITEM_TYPE.file:
			return {
				...base,
				Type: KIT_ITEM_TYPE.file,
				AdditionalInfo: {
					UUID: kitItem.globalID,
					Name: kitItem.name,
					Description: kitItem.description ?? '',
					Size: kitItem.size,
					ContentType: kitItem.contentType,
				},
			};
		case KIT_ITEM_TYPE.dashboard:
			return {
				...base,
				Type: KIT_ITEM_TYPE.dashboard,
				AdditionalInfo: {
					UUID: kitItem.globalID,
					Name: kitItem.name,
					Description: kitItem.description ?? '',
				},
			};
		case KIT_ITEM_TYPE.license:
			return {
				...base,
				Type: KIT_ITEM_TYPE.license,
				AdditionalInfo: kitItem.license,
			};
		case KIT_ITEM_TYPE.macro:
			return {
				...base,
				Type: KIT_ITEM_TYPE.macro,
				AdditionalInfo: {
					Name: kitItem.name,
					Description: kitItem.description ?? '',
					Expansion: kitItem.expansion,
				},
			};
		case KIT_ITEM_TYPE.actionable:
			return {
				...base,
				Type: 'pivot',
				AdditionalInfo: {
					UUID: kitItem.globalID,
					Name: kitItem.name,
					Description: kitItem.description ?? '',
				},
			};
		case KIT_ITEM_TYPE.playbook:
			return {
				...base,
				Type: KIT_ITEM_TYPE.playbook,
				AdditionalInfo: {
					UUID: kitItem.globalID,
					Name: kitItem.name,
					Description: kitItem.description ?? '',
				},
			};
		case KIT_ITEM_TYPE.resource:
			return {
				...base,
				Type: KIT_ITEM_TYPE.resource,
				AdditionalInfo: {
					ResourceName: kitItem.name,
					Description: kitItem.description ?? '',
					Size: kitItem.size,
					VersionNumber: kitItem.version.major,
				},
			};
		case KIT_ITEM_TYPE.scheduledQuery:
			return {
				...base,
				Type: 'scheduled search',
				AdditionalInfo: omitUndefinedShallow({
					Name: kitItem.name,
					Description: kitItem.description ?? '',
					Schedule: kitItem.schedule,
					DefaultDeploymentRules: {
						Disabled: kitItem.isDisabled,
						RunImmediately: kitItem.oneShot,
					},
					Duration: kitItem.duration ?? undefined,
					SearchString: kitItem.query,
					Script: '',
				}),
			};
		case KIT_ITEM_TYPE.scheduledScript:
			return {
				...base,
				Type: 'scheduled search',
				AdditionalInfo: {
					Name: kitItem.name,
					Description: kitItem.description ?? '',
					Schedule: kitItem.schedule,
					DefaultDeploymentRules: {
						Disabled: kitItem.isDisabled,
						RunImmediately: kitItem.oneShot,
					},
					SearchString: '',
					Script: kitItem.script,
				},
			};
		case KIT_ITEM_TYPE.savedQuery:
			return {
				...base,
				Type: 'searchlibrary',
				AdditionalInfo: {
					UUID: kitItem.globalID,
					Name: kitItem.name,
					Description: kitItem.description ?? '',
					Query: kitItem.query,
				},
			};
		case KIT_ITEM_TYPE.template:
			return {
				...base,
				Type: KIT_ITEM_TYPE.template,
				AdditionalInfo: {
					UUID: kitItem.globalID,
					Name: kitItem.name,
					Description: kitItem.description ?? '',
				},
			};
		case KIT_ITEM_TYPE.flow:
			return {
				...base,
				Type: KIT_ITEM_TYPE.flow,
				AdditionalInfo: {
					Name: kitItem.name,
					Description: kitItem.description ?? '',
				},
			};
		case KIT_ITEM_TYPE.autoExtractor:
			return {
				...base,
				Type: 'autoextractor',
				Name: kitItem.name,
				AdditionalInfo: {
					desc: kitItem.description,
					name: kitItem.name,
					module: kitItem.module,
					tag: kitItem.tag,
				},
			};
		case KIT_ITEM_TYPE.alert:
			return {
				...base,
				Type: 'alert',
				Name: kitItem.name,
				AdditionalInfo: {
					Description: kitItem.description,
					Name: kitItem.name,
				},
			};
	}
};

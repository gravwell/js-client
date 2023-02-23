/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { assertUnreachable } from '../../functions/utils/assert-unreachable';
import { ScheduledTaskType } from '../scheduled-task/scheduled-task';
import { getScheduledTaskType } from '../scheduled-task/to-scheduled-task';
import { toVersion } from '../version';
import { KIT_ITEM_TYPE, KitItem, KitItemBase } from './kit-item';
import { RawKitItem } from './raw-kit-item';

const isKitItemFlow = (raw: { AdditionalInfo: { ScheduledType: string } }): boolean =>
	raw.AdditionalInfo.ScheduledType === 'flow';

export const toKitItem = (raw: RawKitItem): KitItem => {
	const base: KitItemBase = {
		id: raw.ID ?? null,
		name: raw.Name,
		hash: raw.Hash,
	};
	const cleanDescription = (v: string): string | null => {
		const trim = v.trim();
		return ['', 'undefined'].includes(trim) ? null : trim;
	};

	if (isKitItemFlow(raw as any)) {
		raw.Type = 'flow';
	}

	switch (raw.Type) {
		case 'file':
			return {
				...base,
				type: KIT_ITEM_TYPE.file,
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				size: raw.AdditionalInfo.Size,
				contentType: raw.AdditionalInfo.ContentType,
			};
		case 'dashboard':
			return {
				...base,
				type: KIT_ITEM_TYPE.dashboard,
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'license':
			return {
				...base,
				type: KIT_ITEM_TYPE.license,
				license: raw.AdditionalInfo,
			};
		case 'macro':
			return {
				...base,
				type: KIT_ITEM_TYPE.macro,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				expansion: raw.AdditionalInfo.Expansion,
			};
		case 'pivot':
			return {
				...base,
				type: KIT_ITEM_TYPE.actionable,
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'playbook':
			return {
				...base,
				type: KIT_ITEM_TYPE.playbook,
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'resource':
			return {
				...base,
				type: KIT_ITEM_TYPE.resource,
				name: raw.AdditionalInfo.ResourceName ?? raw.Name,
				description: raw.AdditionalInfo.Description,
				size: raw.AdditionalInfo.Size,
				version: toVersion(raw.AdditionalInfo.VersionNumber),
			};
		case 'flow':
			return {
				...base,
				type: KIT_ITEM_TYPE.flow,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'scheduled search': {
			const type: ScheduledTaskType = getScheduledTaskType(raw.AdditionalInfo);
			const scheduledBase = {
				...base,
				name: raw.AdditionalInfo.Name,
				description: raw.AdditionalInfo.Description,
				schedule: raw.AdditionalInfo.Schedule,
				isDisabled: raw.AdditionalInfo.DefaultDeploymentRules.Disabled,
				oneShot: raw.AdditionalInfo.DefaultDeploymentRules.RunImmediately,
			};

			switch (type) {
				case 'query':
					return {
						...scheduledBase,
						type: KIT_ITEM_TYPE.scheduledQuery,
						query: raw.AdditionalInfo.SearchString ?? '',
						duration: raw.AdditionalInfo.Duration ?? null,
					};
				case 'script':
					return {
						...scheduledBase,
						type: KIT_ITEM_TYPE.scheduledScript,
						script: raw.AdditionalInfo.Script ?? '',
					};
				default:
					return assertUnreachable(type);
			}
		}
		case 'searchlibrary':
			return {
				...base,
				type: KIT_ITEM_TYPE.savedQuery,
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				query: raw.AdditionalInfo.Query,
			};
		case 'template':
			return {
				...base,
				type: KIT_ITEM_TYPE.template,
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'autoextractor':
			return {
				...base,
				type: KIT_ITEM_TYPE.autoExtractor,
				name: raw.AdditionalInfo.name,
				description: raw.AdditionalInfo.desc,
				tag: raw.AdditionalInfo.tag,
				module: raw.AdditionalInfo.module,
			};
	}
};

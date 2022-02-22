/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ScheduledTaskType } from '../scheduled-task/scheduled-task';
import { getScheduledTaskType } from '../scheduled-task/to-scheduled-task';
import { toVersion } from '../version';
import { KitItem, KitItemBase } from './kit-item';
import { RawKitItem } from './raw-kit-item';

export const toKitItem = (raw: RawKitItem): KitItem => {
	const base: KitItemBase = {
		name: raw.Name,
		hash: raw.Hash,
	};
	const cleanDescription = (v: string): string | null => {
		const trim = v.trim();
		return ['', 'undefined'].includes(trim) ? null : trim;
	};

	switch (raw.Type) {
		case 'file':
			return {
				...base,
				id: raw.ID,
				type: 'file',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				size: raw.AdditionalInfo.Size,
				contentType: raw.AdditionalInfo.ContentType,
			};
		case 'dashboard':
			return {
				...base,
				id: raw.ID,
				type: 'dashboard',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'license':
			return {
				...base,
				type: 'license',
				license: raw.AdditionalInfo,
			};
		case 'macro':
			return {
				...base,
				id: raw.ID,
				type: 'macro',
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				expansion: raw.AdditionalInfo.Expansion,
			};
		case 'pivot':
			return {
				...base,
				id: raw.ID,
				type: 'actionable',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'playbook':
			return {
				...base,
				id: raw.ID,
				type: 'playbook',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'resource':
			return {
				...base,
				id: raw.ID,
				type: 'resource',
				name: raw.AdditionalInfo.ResourceName,
				description: raw.AdditionalInfo.Description,
				size: raw.AdditionalInfo.Size,
				version: toVersion(raw.AdditionalInfo.VersionNumber),
			};
		case 'scheduled search': {
			const type: ScheduledTaskType = getScheduledTaskType(raw.AdditionalInfo);
			const scheduledBase = {
				...base,
				id: raw.ID,
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
						type: 'scheduled query',
						query: raw.AdditionalInfo.SearchString ?? '',
					};
				case 'script':
					return {
						...scheduledBase,
						type: 'scheduled script',
						script: raw.AdditionalInfo.Script ?? '',
					};
			}
			break;
		}

		case 'searchlibrary':
			return {
				...base,
				id: raw.ID,
				type: 'saved query',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				query: raw.AdditionalInfo.Query,
			};
		case 'template':
			return {
				...base,
				id: raw.ID,
				type: 'template',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'autoextractor':
			return {
				...base,
				id: raw.ID,
				type: 'auto extractor',
				name: raw.AdditionalInfo.name,
				description: raw.AdditionalInfo.desc,
				tag: raw.AdditionalInfo.tag,
				module: raw.AdditionalInfo.module,
			};
	}
};

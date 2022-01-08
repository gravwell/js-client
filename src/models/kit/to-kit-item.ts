/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

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
				type: 'macro',
				name: raw.AdditionalInfo.Name,
				expansion: raw.AdditionalInfo.Expansion,
			};
		case 'pivot':
			return {
				...base,
				type: 'actionable',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'playbook':
			return {
				...base,
				type: 'playbook',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
		case 'resource':
			return {
				...base,
				type: 'resource',
				name: raw.AdditionalInfo.ResourceName,
				description: raw.AdditionalInfo.Description,
				size: raw.AdditionalInfo.Size,
				version: toVersion(raw.AdditionalInfo.VersionNumber),
			};
		case 'scheduled search':
			return {
				...base,
				type: 'scheduled script',
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				schedule: raw.AdditionalInfo.Schedule,
				script: raw.AdditionalInfo.Script,
			};
		case 'searchlibrary':
			return {
				...base,
				type: 'saved query',
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
				query: raw.AdditionalInfo.Query,
			};
		case 'template':
			return {
				...base,
				type: 'template',
				globalID: raw.AdditionalInfo.UUID,
				name: raw.AdditionalInfo.Name,
				description: cleanDescription(raw.AdditionalInfo.Description),
			};
	}
};

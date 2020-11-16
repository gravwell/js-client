/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawUUID } from '../../value-objects';

export interface RawKitItemBase {
	Name: string;
	Hash: Array<number>; // 32 elements
}

export interface RawFileKitItem extends RawKitItemBase {
	Type: 'file';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string; // "" is null
		Description: string; // "undefined" and "" are null,
		Size: number;
		ContentType: string;
	};
}

export interface RawDashboardKitItem extends RawKitItemBase {
	Type: 'dashboard';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" are null,
	};
}

export interface RawLicenseKitItem extends RawKitItemBase {
	Type: 'license';
	AdditionalInfo: string;
}

export interface RawMacroKitItem extends RawKitItemBase {
	Type: 'macro';
	AdditionalInfo: {
		Name: string;
		Expansion: string;
	};
}

export interface RawActionableKitItem extends RawKitItemBase {
	Type: 'pivot';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" are null,
	};
}

export interface RawPlaybookKitItem extends RawKitItemBase {
	Type: 'playbook';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" are null,
	};
}

export interface RawResourceKitItem extends RawKitItemBase {
	Type: 'resource';
	AdditionalInfo: {
		ResourceName: string;
		Description: string;
		Size: number;
		VersionNumber: number;
	};
}

export interface RawScheduledScriptKitItem extends RawKitItemBase {
	Type: 'scheduled search';
	AdditionalInfo: {
		Name: string;
		Description: string; // "" are null,
		Schedule: string; // Cron job eg. '* * * * *'
		Script: string;
	};
}

export interface RawSavedQueryKitItem extends RawKitItemBase {
	Type: 'searchlibrary';
	AdditionalInfo: {
		Name: string;
		Description: string; // "" are null,
		Query: string;
	};
}

export interface RawTemplateKitItem extends RawKitItemBase {
	Type: 'template';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" are null,
	};
}

export type RawKitItem =
	| RawFileKitItem
	| RawDashboardKitItem
	| RawLicenseKitItem
	| RawMacroKitItem
	| RawActionableKitItem
	| RawPlaybookKitItem
	| RawResourceKitItem
	| RawScheduledScriptKitItem
	| RawSavedQueryKitItem
	| RawTemplateKitItem;

/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawUUID } from '~/value-objects';

export interface RawKitItemBase {
	ID: string | undefined; // Only exists on LocalKit assets
	Name: string;
	Hash: Array<number>; // 32 elements
}

export interface RawLicenseKitItem extends RawKitItemBase {
	Type: 'license';
	AdditionalInfo: string;
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
		Description: string; // "" is null,
	};
}

export interface RawMacroKitItem extends RawKitItemBase {
	Type: 'macro';
	AdditionalInfo: {
		Name: string;
		Description: string; // "" is null,
		Expansion: string;
	};
}

export interface RawActionableKitItem extends RawKitItemBase {
	Type: 'pivot';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" is null,
	};
}

export interface RawPlaybookKitItem extends RawKitItemBase {
	Type: 'playbook';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" is null,
	};
}

export interface RawResourceKitItem extends RawKitItemBase {
	Type: 'resource';
	AdditionalInfo: {
		ResourceName?: string;
		Description: string;
		Size: number;
		VersionNumber: number;
	};
}

export interface RawScheduledScriptKitItem extends RawKitItemBase {
	Type: 'scheduled search';
	AdditionalInfo: {
		Name: string;
		Description: string;
		Schedule: string; // Cron job eg. '* * * * *'

		// If Script is set, then SearchString and Duration will not be set
		Script?: string; // "" is null,

		// If SearchString and Duration are set, Script will not be set
		SearchString?: string; // "" is null,
		Duration?: number;

		DefaultDeploymentRules: {
			Disabled: boolean;
			/**
			 * If RunImmediately is set to true, we set OneShot = true on the script
			 * as we install it
			 */
			RunImmediately: boolean;
		};
	};
}

export interface RawSavedQueryKitItem extends RawKitItemBase {
	Type: 'searchlibrary';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" is null,
		Query: string;
	};
}

export interface RawTemplateKitItem extends RawKitItemBase {
	Type: 'template';
	AdditionalInfo: {
		UUID: RawUUID;
		Name: string;
		Description: string; // "" is null,
	};
}

export interface RawFlowKitItem extends RawKitItemBase {
	Type: 'flow';
	AdditionalInfo: {
		Name: string;
		Description: string; // "" is null,
	};
}

export interface RawAutoExtractorKitItem extends RawKitItemBase {
	Type: 'autoextractor';
	AdditionalInfo: {
		name: string;
		desc: string;
		module: string;
		tag: string;
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
	| RawTemplateKitItem
	| RawFlowKitItem
	| RawAutoExtractorKitItem;

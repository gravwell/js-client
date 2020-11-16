/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { encode as base64Encode } from 'base-64';
import { encode as utf8Encode } from 'utf8';
import { Version } from '../../models';
import { ID, RawID, RawNumericID, RawUUID, toRawNumericID, UUID } from '../../value-objects';
import {
	APIFunctionMakerOptions,
	buildHTTPRequest,
	buildURL,
	fetch,
	HTTPRequestOptions,
	parseJSONResponse,
} from '../utils';

export const makeBuildOneLocalKit = (makerOptions: APIFunctionMakerOptions) => {
	const templatePath = '/api/kits/build';
	const url = buildURL(templatePath, { ...makerOptions, protocol: 'http' });

	return async (authToken: string | null, data: BuildableKit): Promise<UUID> => {
		try {
			const baseRequestOptions: HTTPRequestOptions = {
				headers: { Authorization: authToken ? `Bearer ${authToken}` : undefined },
				body: JSON.stringify(toRawCreatableLocalKit(data)),
			};
			const req = buildHTTPRequest(baseRequestOptions);

			const raw = await fetch(url, { ...req, method: 'POST' });
			const rawRes = await parseJSONResponse<BuildOneKitRawResponse>(raw);
			return rawRes.UUID;
		} catch (err) {
			if (err instanceof Error) throw err;
			throw Error('Unknown error');
		}
	};
};

interface BuildOneKitRawResponse {
	Size: number;
	UID: RawNumericID;
	UUID: RawUUID;
}

export interface BuildableKit {
	customID: ID;

	name: string;
	description: string;
	version: Version;

	actionableIDs: Array<ID>;
	autoExtractorIDs: Array<ID>;
	dashboardIDs: Array<ID>;
	fileIDs: Array<ID>;
	macroIDs: Array<ID>;
	playbookIDs: Array<ID>;
	resourceIDs: Array<ID>;
	savedQueryIDs: Array<ID>;
	scheduledQueryIDs: Array<ID>;
	scheduledScriptIDs: Array<ID>;
	templateIDs: Array<ID>;

	icon: string;
	licenses: Array<{ name: string; content: string }>;
	settings: Array<{
		type: 'macro value';
		name: string;
		description: string;
		defaultValue: string;
		value: string | null;
		valueType: 'tag' | 'string';
	}>;
}

export interface RawBuildableKit {
	ID: RawID;
	Name: string;
	Description: string;
	Version: number;

	Dashboards: Array<RawNumericID>;
	Extractors: Array<RawUUID>;
	Files: Array<RawUUID>;
	Macros: Array<RawNumericID>;
	Pivots: Array<RawUUID>;
	Playbooks: Array<RawUUID>;
	Resources: Array<RawUUID>;
	ScheduledSearches: Array<RawNumericID>;
	SearchLibraries: Array<RawUUID>;
	Templates: Array<RawUUID>;
	EmbeddedItems: Array<{
		Content: string; // base64 encoded
		Name: string;
		Type: 'license';
	}>;

	Icon: string | null;
	ConfigMacros: Array<{
		DefaultValue: string;
		Description: string;
		MacroName: string;
		Value: string | null;
	}> | null;
}

export const toRawCreatableLocalKit = (data: BuildableKit): RawBuildableKit => ({
	ID: data.customID,

	Name: data.name,
	Description: data.description,
	Version: data.version.major,

	Dashboards: data.dashboardIDs.map(toRawNumericID),
	Extractors: data.autoExtractorIDs,
	Files: data.fileIDs,
	Macros: data.macroIDs.map(toRawNumericID),
	Pivots: data.actionableIDs,
	Playbooks: data.playbookIDs,
	Resources: data.resourceIDs,
	ScheduledSearches: data.scheduledQueryIDs.concat(data.scheduledScriptIDs).map(toRawNumericID),
	Templates: data.templateIDs,
	SearchLibraries: data.savedQueryIDs,
	EmbeddedItems: data.licenses.map(l => ({
		Type: 'license',
		Name: l.name,
		Content: base64Encode(utf8Encode(l.content)),
	})),

	Icon: data.icon,
	ConfigMacros: data.settings.map(s => ({
		DefaultValue: s.defaultValue,
		Description: s.description,
		MacroName: s.name,
		Value: s.value,
	})),
});

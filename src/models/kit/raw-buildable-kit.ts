/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawID, RawNumericID, RawUUID } from '../../value-objects';

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

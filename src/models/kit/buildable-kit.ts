/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { ID } from '../../value-objects';
import { Version } from '../version';

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

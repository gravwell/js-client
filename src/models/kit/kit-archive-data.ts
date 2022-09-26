/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';
import { Version } from './../version';
import { ConfigMacro } from './config-macro';
import { DeployRules } from './kit-archive';

export interface KitArchiveData {
	id: NumericID;
	userID: NumericID;
	buildDate: Date | null;
	name: string;
	description: string;
	version: number;
	minVersion: Version;
	maxVersion: Version;
	readme: string;
	scriptDeployRules: Record<string, DeployRules>;
	// Images
	icon: UUID;
	cover: UUID;
	banner: UUID;
	// embedded items
	embeddedItems: Array<{ content: string; name: string; type: 'license' }>;
	// Contents
	actionables?: Array<UUID>;
	dashboards?: Array<number>;
	extractors?: Array<UUID>;
	files?: Array<UUID>;
	macros?: Array<number>;
	playbooks?: Array<UUID>;
	savedQueries?: Array<UUID>;
	resources?: Array<UUID>;
	scheduledSearches?: Array<UUID>;
	scripts?: Array<UUID>;
	templates?: Array<UUID>;
	// config macros
	configMacros?: Array<ConfigMacro>;
}

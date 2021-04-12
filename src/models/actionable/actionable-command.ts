/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '~/value-objects';

export type ActionableCommand =
	| { type: 'query'; userQuery: string }
	| { type: 'template'; templateUUID: UUID }
	| { type: 'savedQuery'; queryUUID: UUID }
	| { type: 'dashboard'; dashboardUUID: UUID; dashboardVariable: string | null }
	| { type: 'url'; urlTemplate: string; modal: boolean; modalWidthPercentage: number | null };

export interface ActionableQueryCommand {
	type: 'query';
	userQuery: string;
}

export interface ActionableTemplateCommand {
	type: 'template';
	templateUUID: UUID;
}

export interface ActionableSavedQueryCommand {
	type: 'savedQuery';
	queryUUID: UUID;
}

export interface ActionableDashboardCommand {
	type: 'dashboard';
	dashboardUUID: UUID;
	dashboardVariable: string | null;
}

export interface ActionableURLCommand {
	type: 'url';
	urlTemplate: string;
	modal: boolean;
	modalWidthPercentage: number | null;
}

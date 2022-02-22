/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { UUID } from '~/value-objects';

export type ActionableCommand =
	| { type: 'query'; userQuery: string }
	| { type: 'template'; templateID: UUID; templateVariable: string | null }
	| { type: 'savedQuery'; queryID: UUID }
	| { type: 'dashboard'; dashboardID: UUID; dashboardVariable: string | null }
	| {
			type: 'url';
			urlTemplate: string;
			modal: boolean;
			modalWidthPercentage: number | null;

			/**
			 * True means that the actionable value won't be encoded when opening the URL.
			 *
			 * @default false
			 */
			noValueUrlEncode: boolean;
	  };

export interface ActionableQueryCommand {
	type: 'query';
	userQuery: string;
}

export interface ActionableTemplateCommand {
	type: 'template';
	templateID: UUID;
}

export interface ActionableSavedQueryCommand {
	type: 'savedQuery';
	queryID: UUID;
}

export interface ActionableDashboardCommand {
	type: 'dashboard';
	dashboardID: UUID;
	dashboardVariable: string | null;
}

export interface ActionableURLCommand {
	type: 'url';
	urlTemplate: string;
	modal: boolean;
	modalWidthPercentage: number | null;

	/**
	 * True means that the actionable value won't be encoded when opening the URL.
	 *
	 * @default false
	 */
	noValueUrlEncode: boolean;
}

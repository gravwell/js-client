/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { RawUUID } from '~/value-objects';

export type RawActionableCommand =
	| RawActionableQueryCommand
	| RawActionableTemplateCommand
	| RawActionableSavedQueryCommand
	| RawActionableDashboardCommand
	| RawActionableURLCommand;

export interface RawActionableQueryCommand {
	type: 'query';
	reference: string;
	options?: object;
}

export interface RawActionableTemplateCommand {
	type: 'template';
	reference: RawUUID;
	options?: { variable?: string };
}

export interface RawActionableSavedQueryCommand {
	type: 'savedQuery';
	reference: RawUUID;
	options?: object;
}

export interface RawActionableDashboardCommand {
	type: 'dashboard';
	reference: RawUUID;
	options?: { variable?: string };
}

export interface RawActionableURLCommand {
	type: 'url';
	reference: string;
	options?: {
		modal?: boolean;
		modalWidth?: string;

		/**
		 * True means that the actionable value won't be encoded when opening the
		 * URL.
		 *
		 * @default false
		 */
		noValueUrlEncode?: boolean;
	};
}

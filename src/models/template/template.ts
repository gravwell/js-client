/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { NumericID, UUID } from '~/value-objects';

export interface Template {
	uuid: UUID;
	thingUUID: UUID;
	userID: NumericID;
	groupIDs: Array<NumericID>;
	name: string;
	description: string | null;
	labels: Array<string>;
	isGlobal: boolean;
	lastUpdateDate: Date;
	query: string;
	variables: Array<TemplateVariable>;
}

export type TemplateVariable = {
	name: string; // eg %%VAR%%
	label: string;
	description?: string; // Hint
	required?: boolean;
	defaultValue?: string;
	previewValue?: string | null;
};

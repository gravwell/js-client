/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { RawTemplate } from './raw-template';
import { Template } from './template';

export const toTemplate = (raw: RawTemplate): Template => ({
	uuid: raw.GUID,
	thingUUID: raw.ThingUUID,

	userID: raw.UID.toString(),
	groupIDs: raw.GIDs?.map(id => id.toString()) ?? [],

	name: raw.Name,
	description: raw.Description.trim() === '' ? null : raw.Description,
	labels: raw.Labels ?? [],

	isGlobal: raw.Global,
	isRequired: raw.Contents.required,

	lastUpdateDate: new Date(raw.Updated),

	query: raw.Contents.query,
	variable: {
		token: raw.Contents.variable,
		name: raw.Contents.variableLabel,
		description: raw.Contents.variableDescription?.trim() === '' ? null : raw.Contents.variableDescription,
	},

	previewValue: (raw.Contents.testValue ?? '').trim() === '' ? null : raw.Contents.testValue,
});

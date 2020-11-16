/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isDate, isNull, isString } from 'lodash';
import { isNumericID, isUUID, NumericID, RawNumericID, RawUUID, UUID } from '../value-objects';

export interface Template {
	uuid: UUID;
	thingUUID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;

	name: string;
	description: string | null;
	labels: Array<string>;

	isGlobal: boolean;
	isRequired: boolean;

	lastUpdateDate: Date;

	query: string;
	variable: {
		token: string;
		name: string;
		description: string | null;
	};

	previewValue: string | null;
}

export interface RawTemplate {
	GUID: RawUUID;
	ThingUUID: RawUUID;
	UID: RawNumericID;
	GIDs: null | Array<RawNumericID>;
	Global: boolean;
	Name: string;
	Description: string; // Empty string is null
	Updated: string; // Timestamp
	Contents: {
		query: string;
		variable: string;
		variableLabel: string;
		variableDescription: string | null;
		required: boolean;
		testValue: string | null;
	};
	Labels: null | Array<string>;
}

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

export const isTemplate = (value: any): value is Template => {
	try {
		const t = <Template>value;
		return (
			isUUID(t.uuid) &&
			isUUID(t.thingUUID) &&
			isNumericID(t.userID) &&
			t.groupIDs.every(isNumericID) &&
			isString(t.name) &&
			(isString(t.description) || isNull(t.description)) &&
			t.labels.every(isString) &&
			isBoolean(t.isGlobal) &&
			isBoolean(t.isRequired) &&
			isDate(t.lastUpdateDate) &&
			isString(t.query) &&
			isString(t.variable.token) &&
			isString(t.variable.name) &&
			(isString(t.variable.description) || isNull(t.variable.description)) &&
			(isString(t.previewValue) || isNull(t.previewValue))
		);
	} catch {
		return false;
	}
};

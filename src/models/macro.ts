/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isDate, isNull, isString } from 'lodash';
import { isNumericID, NumericID, RawNumericID, toNumericID } from '../value-objects';

export interface Macro {
	id: NumericID;
	userID: NumericID;
	groupIDs: Array<NumericID>;

	/**
	 * All uppercase and no spaces.
	 */
	name: string;
	description: string | null;
	labels: Array<string>;

	expansion: string;
	lastUpdateDate: Date;
}

export interface RawMacro {
	ID: RawNumericID;
	UID: RawNumericID;
	GIDs: Array<RawNumericID> | null;
	Name: string;
	Description: string; // Empty string is null
	Expansion: string;
	Labels: Array<string> | null;
	LastUpdated: string; // Timestamp
	Synced: boolean;
}

export const toMacro = (raw: RawMacro): Macro => ({
	id: toNumericID(raw.ID),
	userID: toNumericID(raw.UID),
	groupIDs: raw.GIDs?.map(toNumericID) ?? [],

	name: raw.Name,
	description: raw.Description.trim() === '' ? null : raw.Description,
	labels: raw.Labels ?? [],

	expansion: raw.Expansion,

	lastUpdateDate: new Date(raw.LastUpdated),
});

export const isMacro = (value: any): value is Macro => {
	try {
		const m = <Macro>value;
		return (
			isNumericID(m.id) &&
			isNumericID(m.userID) &&
			m.groupIDs.every(isNumericID) &&
			isString(m.name) &&
			(isString(m.description) || isNull(m.description)) &&
			m.labels.every(isString) &&
			isString(m.expansion) &&
			isDate(m.lastUpdateDate)
		);
	} catch {
		return false;
	}
};

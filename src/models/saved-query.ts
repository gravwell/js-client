/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isBoolean, isNull, isString } from 'lodash';
import { isNumericID, isUUID, NumericID, RawNumericID, RawUUID, toNumericID, UUID } from '../value-objects';
import { isTimeframe, RawTimeframe, Timeframe, toTimeframe } from './timeframe';

export interface SavedQuery {
	id: UUID;
	globalID: UUID;

	userID: NumericID;
	groupIDs: Array<NumericID>;
	isGlobal: boolean;

	name: string;
	description: string | null;
	labels: Array<string>;

	query: string;
	defaultTimeframe: Timeframe | null;
}

export interface RawSavedQuery {
	ThingUUID: RawUUID;
	GUID: RawUUID;

	UID: RawNumericID;
	GIDs?: Array<RawNumericID> | null;
	Global: boolean;

	Name: string;
	Description: string; // Empty is null
	Labels?: Array<string> | null;

	Query: string;
	Metadata?: { timeframe?: RawTimeframe | null } | null;
}

export const toSavedQuery = (raw: RawSavedQuery): SavedQuery => {
	const rawTimeframe = raw.Metadata?.timeframe ?? null;
	const defaultTimeframe = isNull(rawTimeframe) ? null : toTimeframe(rawTimeframe);

	return {
		id: raw.ThingUUID,
		globalID: raw.GUID,

		userID: toNumericID(raw.UID),
		groupIDs: raw.GIDs?.map(toNumericID) ?? [],
		isGlobal: raw.Global ?? false,

		name: raw.Name,
		description: raw.Description.trim() === '' ? null : raw.Description,
		labels: raw.Labels ?? [],

		query: raw.Query,
		defaultTimeframe,
	};
};

export const isSavedQuery = (value: any): value is SavedQuery => {
	try {
		const q = <SavedQuery>value;
		return (
			isUUID(q.id) &&
			isUUID(q.globalID) &&
			isNumericID(q.userID) &&
			q.groupIDs.every(isNumericID) &&
			isBoolean(q.isGlobal) &&
			isString(q.name) &&
			(isString(q.description) || isNull(q.description)) &&
			q.labels.every(isString) &&
			isString(q.query) &&
			(isTimeframe(q.defaultTimeframe) || isNull(q.defaultTimeframe))
		);
	} catch {
		return false;
	}
};

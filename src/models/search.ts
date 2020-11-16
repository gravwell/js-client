/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isDate, isString, isUndefined } from 'lodash';
import { omitUndefinedShallow } from '../functions/utils/omit-undefined-shallow';
import { NumericID, isNumericID } from '../value-objects';

export interface Search {
	userID: NumericID;
	groupID?: NumericID;
	userQuery: string;
	effectiveQuery: string;
	launchDate: Date;
}

export interface RawSearch {
	UID: number;
	GID: number; // zero is undefined
	UserQuery: string;
	EffectiveQuery: string;
	Launched: string; // Timestamp eg. '2020-08-07T20:42:32.981542Z'
}

export const toSearch = (raw: RawSearch): Search =>
	omitUndefinedShallow({
		userID: raw.UID.toString(),
		groupID: raw.GID === 0 ? undefined : raw.GID.toString(),
		userQuery: raw.UserQuery,
		effectiveQuery: raw.EffectiveQuery,
		launchDate: new Date(raw.Launched),
	});

export const isValidSearch = (value: any): value is Search => {
	try {
		const s = <Search>value;
		return (
			isNumericID(s.userID) &&
			(isUndefined(s.groupID) || isNumericID(s.groupID)) &&
			isString(s.effectiveQuery) &&
			isString(s.userQuery) &&
			isDate(s.launchDate)
		);
	} catch {
		return false;
	}
};

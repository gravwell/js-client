/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isInteger, isUndefined } from 'lodash';
import { omitUndefinedShallow } from '../functions/utils/omit-undefined-shallow';
import { NumericID, isNumericID } from '../value-objects';

export interface RawSearch2 {
	ID: string;
	UID: number;
	GID: number; // zero is undefined
	State: string; // RawSearch2State or RawSearch2State/RawSearch2State eg. 'ACTIVE' or 'SAVED/BACKGROUNDED'
	AttachedClients: number;
	StoredData: number;
}

type RawSearch2State = 'ACTIVE' | 'DORMANT' | 'SAVED' | 'BACKGROUNDED' | 'ATTACHED' | 'SAVING';

export interface Search2 {
	id: NumericID;
	userID: NumericID;
	groupID?: NumericID;
	states: Array<'active' | 'dormant' | 'backgrounded' | 'saved' | 'attached' | 'saving'>;
	attachedClients: number;
	storedData: number;
}

export type Search2State = Search2['states'][number];

const toSearch2State = (raw: RawSearch2State): Search2State => {
	switch (raw) {
		case 'ACTIVE':
			return 'active';
		case 'DORMANT':
			return 'dormant';
		case 'BACKGROUNDED':
			return 'backgrounded';
		case 'SAVED':
			return 'saved';
		case 'ATTACHED':
			return 'attached';
		case 'SAVING':
			return 'saving';
	}
};

const isSearch2State = (value: any): value is Search2State =>
	(<Array<Search2State>>['active', 'dormant', 'backgrounded', 'saved', 'saving', 'attached']).includes(value);

export const toSearch2 = (raw: RawSearch2): Search2 =>
	omitUndefinedShallow({
		id: raw.ID,
		userID: raw.UID.toString(),
		groupID: raw.GID === 0 ? undefined : raw.GID.toString(),
		states: (raw.State.split('/') as Array<RawSearch2State>).map(toSearch2State),
		attachedClients: raw.AttachedClients,
		storedData: raw.StoredData,
	});

export const isSearch2 = (value: any): value is Search2 => {
	try {
		const s = <Search2>value;
		return (
			isNumericID(s.userID) &&
			(isUndefined(s.groupID) || isNumericID(s.groupID)) &&
			s.states.every(isSearch2State) &&
			isInteger(s.attachedClients) &&
			isInteger(s.storedData)
		);
	} catch {
		return false;
	}
};

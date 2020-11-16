/*************************************************************************
 * Copyright 2020 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isNull, isString } from 'lodash';
import { NumericID, isNumericID } from '../value-objects';

export interface RawGroup {
	GID: number;
	Name: string;
	Desc: string; // Empty is null
	Synced: boolean;
}

export interface Group {
	id: NumericID;
	name: string;
	description: string | null;
}

export const toGroup = (raw: RawGroup): Group => ({
	id: raw.GID.toString(),
	name: raw.Name,
	description: raw.Desc.trim() === '' ? null : raw.Desc.trim(),
});

export const isGroup = (value: any): value is Group => {
	try {
		const g = <Group>value;
		return isNumericID(g.id) && isString(g.name) && (isString(g.description) || isNull(g.description));
	} catch {
		return false;
	}
};

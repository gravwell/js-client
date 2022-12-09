/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { isBoolean, isDate, isNumber, isString, isUndefined } from 'lodash';
import { isUUID } from '~/value-objects';

export type Shard = {
	name: string;
	start: Date;
	end: Date;
	entries: number;
	size: number;
	cold: boolean;
	remoteState?: ShardRemoteState | undefined;
};

export type ShardRemoteState = {
	uuid: string;
	entries: number;
	size: number;
};

export const isShard = (value: unknown): value is Shard => {
	try {
		const s = value as Shard;

		return (
			isString(s.name) &&
			isDate(s.start) &&
			isDate(s.end) &&
			isNumber(s.entries) &&
			isNumber(s.size) &&
			isBoolean(s.cold) &&
			(isUndefined(s.remoteState) ||
				(isUUID(s.remoteState.uuid) && isNumber(s.remoteState.entries) && isNumber(s.remoteState.size)))
		);
	} catch {
		return false;
	}
};

/*************************************************************************
 * Copyright 2021 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString, isUndefined } from 'lodash';
import { isShard, Shard } from './shard';

export interface ReplicatedState {
	name: string;
	accelerator?: string;
	engine?: string;
	tags: Array<string>;
	shards: Array<Shard>;
}

export const isReplicatedState = (value: unknown): value is ReplicatedState => {
	try {
		const r = <ReplicatedState>value;

		return (
			isString(r.name) &&
			(isUndefined(r.accelerator) || isString(r.accelerator)) &&
			(isUndefined(r.engine) || isString(r.engine)) &&
			r.tags.every(isString) &&
			r.shards.every(isShard)
		);
	} catch {
		return false;
	}
};

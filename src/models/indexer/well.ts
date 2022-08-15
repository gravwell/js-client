/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { isString, isUndefined } from 'lodash';
import { isShard, Shard } from './shard';

export type Well = {
	name: string;
	accelerator?: string;
	engine?: string;
	path: string;
	tags: Array<string>;
	shards: Array<Shard>;
};

export const isWell = (value: unknown): value is Well => {
	try {
		const w = value as Well;

		return (
			isString(w.name) &&
			(isUndefined(w.accelerator) || isString(w.accelerator)) &&
			(isUndefined(w.engine) || isString(w.engine)) &&
			isString(w.path) &&
			w.tags.every(isString) &&
			w.shards.every(isShard)
		);
	} catch {
		return false;
	}
};

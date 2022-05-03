/*************************************************************************
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 * Contact: <legal@gravwell.io>
 *
 * This software may be modified and distributed under the terms of the
 * MIT license. See the LICENSE file for details.
 **************************************************************************/

import { assertIsRawIndexerWellResponse } from './assert-is-raw-indexer-response';
import { IndexerWell } from './indexer-well';
import { RawIndexerWellResponse } from './raw-indexer-well';
import { RawReplicatedState } from './raw-replicated-state';
import { RawShard } from './raw-shard';
import { RawWell } from './raw-well';
import { ReplicatedState } from './replicated-state';
import { Shard } from './shard';
import { Well } from './well';

export const toIndexerWell = (data: RawIndexerWellResponse): Array<IndexerWell> => {
	assertIsRawIndexerWellResponse(data);

	return Object.entries(data).map(([name, { UUID, Wells, Replicated }]) => ({
		uuid: UUID,
		name: name,
		wells: Wells.map(toWell),
		replicated: toReplicatedState(Replicated),
	}));
};

const toWell = (well: RawWell): Well => {
	return {
		name: well.Name,
		accelerator: well.Accelerator,
		engine: well.Engine,
		path: well.Path,
		tags: well.Tags,
		shards: well.Shards.map(toShard),
	};
};

const toReplicatedState = (
	raw: Record<string, Array<RawReplicatedState>> | undefined,
): Record<string, Array<ReplicatedState>> | undefined => {
	if (raw === undefined) return raw;

	return Object.entries(raw)
		.map(([key, replicatedStateList]) => {
			const list = replicatedStateList.map(data => {
				return {
					name: data.Name,
					accelerator: data.Accelerator,
					engine: data.Engine,
					tags: data.Tags,
					shards: data.Shards.map(toShard),
				};
			});

			return { key, list };
		})
		.reduce<Record<string, Array<ReplicatedState>>>((acc, curr) => {
			acc[curr.key] = curr.list;
			return acc;
		}, {});
};

const toShard = (shard: RawShard): Shard => {
	const _shardPartial = {
		name: shard.Name,
		start: new Date(shard.Start),
		end: new Date(shard.End),
		entries: shard.Entries,
		size: shard.Size,
		cold: shard.Cold,
	};
	const _remoteState = shard.RemoteState && {
		uuid: shard.RemoteState.UUID,
		entries: shard.RemoteState.Entries,
		size: shard.RemoteState.Size,
	};
	return {
		..._shardPartial,
		remoteState: _remoteState,
	};
};

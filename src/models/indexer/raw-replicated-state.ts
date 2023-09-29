/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { array, object, optional, string, Verifier } from '~/functions/utils/verifiers';
import { RawShard, rawShardDecoder } from './raw-shard';

export interface RawReplicatedState {
	Name: string;
	Accelerator?: string;
	Engine?: string;
	Tags: Array<string>;
	Shards: Array<RawShard>;
}

export const rawReplicatedStateDecoder: Verifier<RawReplicatedState> = object({
	Name: string,
	Accelerator: optional(string),
	Engine: optional(string),
	Tags: array(string),
	Shards: array(rawShardDecoder),
});

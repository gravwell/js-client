/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { array, Decoder, dict, guard, object, string } from 'decoders';
import { RawIndexerWell, RawIndexerWellResponse } from './raw-indexer-well';
import { RawReplicatedState, rawReplicatedStateDecoder } from './raw-replicated-state';
import { rawWellDecoder } from './raw-well';

const rawIndexerWellDecoder: Decoder<RawIndexerWellResponse> = dict<RawIndexerWell>(
	object({
		UUID: string,
		Wells: array(rawWellDecoder),
		Replicated: dict<Array<RawReplicatedState>>(array(rawReplicatedStateDecoder)),
	}),
);

type AssertIsRawIndexerWellResponse = (value: unknown) => asserts value is RawIndexerWellResponse;

const rawIndexerWellGuard = guard(rawIndexerWellDecoder);

export const assertIsRawIndexerWellResponse: AssertIsRawIndexerWellResponse = value => rawIndexerWellGuard(value);

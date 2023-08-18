/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { array, dict, object, string, Verifier } from '~/functions/utils/verifiers';
import { RawIndexerWell, RawIndexerWellResponse } from './raw-indexer-well';
import { RawReplicatedState, rawReplicatedStateDecoder } from './raw-replicated-state';
import { rawWellDecoder } from './raw-well';

const rawIndexerWellDecoder: Verifier<RawIndexerWellResponse> = dict<RawIndexerWell>(
	object({
		UUID: string,
		Wells: array(rawWellDecoder),
		Replicated: dict<Array<RawReplicatedState>>(array(rawReplicatedStateDecoder)),
	}),
);

type AssertIsRawIndexerWellResponse = (value: unknown) => asserts value is RawIndexerWellResponse;

export const assertIsRawIndexerWellResponse: AssertIsRawIndexerWellResponse = value =>
	rawIndexerWellDecoder.verify(value);

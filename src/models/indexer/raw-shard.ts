/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { boolean, iso8601String, number, object, optional, string, Verifier } from '~/functions/utils/verifiers';

type ISO8601String = string;

export type RawShard = {
	Name: string;
	Start: ISO8601String;
	End: ISO8601String;
	Entries: number;
	Size: number;
	Cold: boolean;
	RemoteState?: {
		UUID: string;
		Entries: number;
		Size: number;
	};
};

export const rawShardDecoder: Verifier<RawShard> = object({
	Name: string,
	Start: iso8601String,
	End: iso8601String,
	Entries: number,
	Size: number,
	Cold: boolean,
	RemoteState: optional(
		object({
			UUID: string,
			Entries: number,
			Size: number,
		}),
	),
});

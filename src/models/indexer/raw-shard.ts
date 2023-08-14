/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { boolean, Decoder, iso8601, number, object, optional, string } from 'decoders';

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

export const rawShardDecoder: Decoder<RawShard> = object({
	Name: string,
	Start: iso8601.transform(date => date.toISOString()),
	End: iso8601.transform(date => date.toISOString()),
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

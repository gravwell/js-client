/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { Decoder, object, optional, string } from 'decoders';

export interface CreatableGroup {
	name: string;
	description?: string;
}

export const creatableGroupDecoder: Decoder<CreatableGroup> = object({ name: string, description: optional(string) });

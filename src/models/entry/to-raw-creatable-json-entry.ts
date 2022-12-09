/**
 * Copyright 2022 Gravwell, Inc. All rights reserved. Contact:
 * [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { encode as base64Encode } from 'base-64';
import { encode as utf8Encode } from 'utf8';
import { CreatableJSONEntry } from './creatable-json-entry';
import { RawCreatableJSONEntry } from './raw-creatable-json-entry';

export const toRawCreatableJSONEntry = (creatable: CreatableJSONEntry): RawCreatableJSONEntry => ({
	TS: creatable.timestamp ?? new Date().toISOString(),
	Tag: creatable.tag,
	Data: base64Encode(utf8Encode(creatable.data)),
});

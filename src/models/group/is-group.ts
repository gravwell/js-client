/**
 * Copyright 2022 Gravwell, Inc. All rights reserved.
 *
 * Contact: [legal@gravwell.io](mailto:legal@gravwell.io)
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 */

import { boolean, Decoder, hardcoded, inexact, nullable, string } from 'decoders';
import { mkTypeGuard } from '../../functions/utils/type-guards';
import { isNumericIdDecoder } from '../../value-objects';
import { DATA_TYPE } from '../data-type';
import { Group } from './group';

export const isGroupDecoder: Decoder<Group> = inexact({
	_tag: hardcoded(DATA_TYPE.GROUP),
	id: isNumericIdDecoder,
	name: string,
	description: nullable(string),
	isSynced: boolean,
});

export const isGroup: (v: unknown) => v is Group = mkTypeGuard(isGroupDecoder);
